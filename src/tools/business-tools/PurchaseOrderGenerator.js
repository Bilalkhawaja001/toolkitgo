import React, { useEffect, useMemo, useState } from 'react';
import BusinessDocShell from './BusinessDocShell';
import {
  createDoc, drawDocHeader, drawPartyBlock, drawTable, drawTotalsBlock, drawNotes,
  drawFooterDisclaimer, downloadPdf, money, parseNum, formatDate, safeFilename,
  loadDraft, saveDraft, clearDraft
} from './businessPdfUtils';

const SLUG = 'purchase-order-generator';
const today = new Date().toISOString().slice(0, 10);
const newRow = () => ({ description: '', qty: 1, unit: 'pcs', rate: 0 });
const INITIAL = {
  company: '', vendor: '', poNo: 'PO-001', poDate: today, deliveryDate: today,
  location: '', tax: 0, terms: 'Goods to be delivered as per agreed schedule.', authorizedBy: '',
  items: [{ description: 'Item', qty: 1, unit: 'pcs', rate: 100 }]
};

function PurchaseOrderGenerator() {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const d = loadDraft(SLUG);
    if (d) setForm((f) => ({ ...f, ...d, items: Array.isArray(d.items) && d.items.length ? d.items : f.items }));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (JSON.stringify(form) === JSON.stringify(INITIAL)) clearDraft(SLUG);
    else saveDraft(SLUG, form);
  }, [form, loaded]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateItem = (i, k, v) => setForm((f) => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));
  const addRow = () => setForm((f) => ({ ...f, items: [...f.items, newRow()] }));
  const removeRow = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((s, it) => s + parseNum(it.qty) * parseNum(it.rate), 0);
    const taxAmount = subtotal * parseNum(form.tax) / 100;
    return { subtotal, taxAmount, grandTotal: subtotal + taxAmount };
  }, [form.items, form.tax]);

  const validate = () => {
    if (!form.company.trim()) return 'Company name required hai.';
    if (!form.vendor.trim()) return 'Vendor name required hai.';
    if (!form.poNo.trim()) return 'PO number required hai.';
    if (!form.items.some((it) => String(it.description).trim() && parseNum(it.qty) > 0)) return 'Kam az kam ek valid item row chahiye.';
    return '';
  };

  const download = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const doc = createDoc();
    let y = drawDocHeader(doc, {
      title: 'Purchase Order',
      leftLines: [],
      rightLines: [`PO #: ${form.poNo}`, `PO date: ${formatDate(form.poDate)}`, `Delivery: ${formatDate(form.deliveryDate)}`]
    });
    const yLeft = drawPartyBlock(doc, 40, y, 'Buyer', [form.company]);
    const yRight = drawPartyBlock(doc, 320, y, 'Vendor', [form.vendor]);
    y = Math.max(yLeft, yRight);
    y = drawPartyBlock(doc, 40, y + 6, 'Delivery Location', [form.location || '-']) + 4;
    const body = form.items.map((it) => [
      it.description || '-',
      String(parseNum(it.qty)),
      it.unit || '-',
      money(it.rate),
      money(parseNum(it.qty) * parseNum(it.rate))
    ]);
    y = drawTable(doc, {
      head: [['Description', 'Qty', 'Unit', 'Rate', 'Amount']],
      body,
      startY: y,
      columnStyles: { 1: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } }
    });
    y = drawTotalsBlock(doc, y + 20, [
      { label: 'Subtotal', value: money(totals.subtotal) },
      { label: `Tax (${parseNum(form.tax)}%)`, value: money(totals.taxAmount) },
      { label: 'Grand Total', value: money(totals.grandTotal), bold: true }
    ]);
    y = drawNotes(doc, y + 10, 'Terms', form.terms);
    drawPartyBlock(doc, 40, y + 10, 'Authorized By', [form.authorizedBy || '-']);
    drawFooterDisclaimer(doc, 'Generated locally in your browser. Verify before official use.');
    downloadPdf(doc, safeFilename(`purchase-order-${form.poNo}`, 'purchase-order'));
  };

  const clearAll = () => {
    clearDraft(SLUG);
    setForm(INITIAL);
    setError('');
  };

  return (
    <BusinessDocShell
      toolId={SLUG}
      title="Purchase Order Generator"
      subtitle="Client-side A4 purchase order via jsPDF + autoTable. Totals calculated in your browser."
      error={error}
      onDownload={download}
      onClear={clearAll}
    >
      <div className="simple-form-grid">
        <label>PO number<input className="form-input" value={form.poNo} onChange={(e) => set('poNo', e.target.value)} /></label>
        <label>PO date<input className="form-input" type="date" value={form.poDate} onChange={(e) => set('poDate', e.target.value)} /></label>
        <label>Delivery date<input className="form-input" type="date" value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} /></label>
        <label>Tax %<input className="form-input" type="number" min="0" value={form.tax} onChange={(e) => set('tax', e.target.value)} /></label>
      </div>
      <div className="phase1b-two-panel">
        <label>Company name / details<textarea className="form-textarea" value={form.company} onChange={(e) => set('company', e.target.value)} /></label>
        <label>Vendor name / details<textarea className="form-textarea" value={form.vendor} onChange={(e) => set('vendor', e.target.value)} /></label>
      </div>
      <label className="field-stack"><span className="field-title">Delivery location</span><input className="form-input" value={form.location} onChange={(e) => set('location', e.target.value)} /></label>
      <div className="invoice-items">
        <h3>Item rows</h3>
        {form.items.map((it, idx) => (
          <div className="invoice-row po-row" key={idx}>
            <input className="form-input" placeholder="Description" value={it.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
            <input className="form-input" type="number" min="0" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
            <input className="form-input" placeholder="Unit" value={it.unit} onChange={(e) => updateItem(idx, 'unit', e.target.value)} />
            <input className="form-input" type="number" min="0" placeholder="Rate" value={it.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} />
            <button type="button" className="btn btn-secondary" onClick={() => removeRow(idx)} disabled={form.items.length === 1}>Remove</button>
          </div>
        ))}
        <div className="tool-button-row"><button type="button" className="btn btn-secondary" onClick={addRow}>Add row</button></div>
      </div>
      <div className="phase1b-two-panel">
        <label>Terms<textarea className="form-textarea" value={form.terms} onChange={(e) => set('terms', e.target.value)} /></label>
        <label>Authorized by<input className="form-input" value={form.authorizedBy} onChange={(e) => set('authorizedBy', e.target.value)} /></label>
      </div>
      <div className="result-card-grid">
        <div><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div>
        <div><span>Tax</span><strong>{money(totals.taxAmount)}</strong></div>
        <div><span>Grand total</span><strong>{money(totals.grandTotal)}</strong></div>
      </div>
    </BusinessDocShell>
  );
}

export default PurchaseOrderGenerator;
