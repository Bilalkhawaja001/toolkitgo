import React, { useEffect, useMemo, useState } from 'react';
import BusinessDocShell from './BusinessDocShell';
import {
  createDoc, drawDocHeader, drawPartyBlock, drawTable, drawTotalsBlock, drawNotes,
  drawFooterDisclaimer, downloadPdf, money, parseNum, formatDate, safeFilename,
  loadDraft, saveDraft, clearDraft
} from './businessPdfUtils';

const SLUG = 'quotation-generator';
const today = new Date().toISOString().slice(0, 10);
const newRow = () => ({ description: '', qty: 1, rate: 0 });
const INITIAL = {
  company: '', customer: '', quoteNo: 'QTN-001', date: today, validUntil: today,
  discount: 0, tax: 0, terms: 'Prices valid until the date shown. Subject to confirmation.',
  items: [{ description: 'Service / item', qty: 1, rate: 100 }]
};

function QuotationGenerator() {
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
    const discountAmount = subtotal * parseNum(form.discount) / 100;
    const taxable = subtotal - discountAmount;
    const taxAmount = taxable * parseNum(form.tax) / 100;
    return { subtotal, discountAmount, taxAmount, grandTotal: taxable + taxAmount };
  }, [form.items, form.discount, form.tax]);

  const validate = () => {
    if (!form.company.trim()) return 'Company name required hai.';
    if (!form.customer.trim()) return 'Customer name required hai.';
    if (!form.quoteNo.trim()) return 'Quotation number required hai.';
    if (!form.items.some((it) => String(it.description).trim() && parseNum(it.qty) > 0)) return 'Kam az kam ek valid item row chahiye.';
    return '';
  };

  const download = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const doc = createDoc();
    let y = drawDocHeader(doc, {
      title: 'Quotation',
      leftLines: [],
      rightLines: [`Quote #: ${form.quoteNo}`, `Date: ${formatDate(form.date)}`, `Valid until: ${formatDate(form.validUntil)}`]
    });
    const yLeft = drawPartyBlock(doc, 40, y, 'From', [form.company]);
    const yRight = drawPartyBlock(doc, 320, y, 'To', [form.customer]);
    y = Math.max(yLeft, yRight) + 8;
    const body = form.items.map((it) => [
      it.description || '-',
      String(parseNum(it.qty)),
      money(it.rate),
      money(parseNum(it.qty) * parseNum(it.rate))
    ]);
    y = drawTable(doc, {
      head: [['Description', 'Qty', 'Rate', 'Amount']],
      body,
      startY: y,
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
    });
    y = drawTotalsBlock(doc, y + 20, [
      { label: 'Subtotal', value: money(totals.subtotal) },
      { label: `Discount (${parseNum(form.discount)}%)`, value: money(totals.discountAmount) },
      { label: `Tax (${parseNum(form.tax)}%)`, value: money(totals.taxAmount) },
      { label: 'Grand Total', value: money(totals.grandTotal), bold: true }
    ]);
    y = drawNotes(doc, y + 10, 'Terms & Conditions', form.terms);
    drawFooterDisclaimer(doc, 'Generated locally in your browser. Not a tax invoice. Verify before official use.');
    downloadPdf(doc, safeFilename(`quotation-${form.quoteNo}`, 'quotation'));
  };

  const clearAll = () => {
    clearDraft(SLUG);
    setForm(INITIAL);
    setError('');
  };

  return (
    <BusinessDocShell
      toolId={SLUG}
      title="Quotation Generator"
      subtitle="Client-side A4 quotation via jsPDF + autoTable. Totals calculated in your browser."
      error={error}
      onDownload={download}
      onClear={clearAll}
    >
      <div className="simple-form-grid">
        <label>Quotation number<input className="form-input" value={form.quoteNo} onChange={(e) => set('quoteNo', e.target.value)} /></label>
        <label>Date<input className="form-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></label>
        <label>Valid until<input className="form-input" type="date" value={form.validUntil} onChange={(e) => set('validUntil', e.target.value)} /></label>
        <label>Discount %<input className="form-input" type="number" min="0" value={form.discount} onChange={(e) => set('discount', e.target.value)} /></label>
        <label>Tax %<input className="form-input" type="number" min="0" value={form.tax} onChange={(e) => set('tax', e.target.value)} /></label>
      </div>
      <div className="phase1b-two-panel">
        <label>Company name / details<textarea className="form-textarea" value={form.company} onChange={(e) => set('company', e.target.value)} /></label>
        <label>Customer name / details<textarea className="form-textarea" value={form.customer} onChange={(e) => set('customer', e.target.value)} /></label>
      </div>
      <div className="invoice-items">
        <h3>Item rows</h3>
        {form.items.map((it, idx) => (
          <div className="invoice-row" key={idx}>
            <input className="form-input" placeholder="Description" value={it.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
            <input className="form-input" type="number" min="0" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
            <input className="form-input" type="number" min="0" placeholder="Rate" value={it.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} />
            <button type="button" className="btn btn-secondary" onClick={() => removeRow(idx)} disabled={form.items.length === 1}>Remove</button>
          </div>
        ))}
        <div className="tool-button-row"><button type="button" className="btn btn-secondary" onClick={addRow}>Add row</button></div>
      </div>
      <label className="field-stack"><span className="field-title">Terms &amp; conditions</span><textarea className="form-textarea" value={form.terms} onChange={(e) => set('terms', e.target.value)} /></label>
      <div className="result-card-grid">
        <div><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></div>
        <div><span>Discount</span><strong>{money(totals.discountAmount)}</strong></div>
        <div><span>Tax</span><strong>{money(totals.taxAmount)}</strong></div>
        <div><span>Grand total</span><strong>{money(totals.grandTotal)}</strong></div>
      </div>
    </BusinessDocShell>
  );
}

export default QuotationGenerator;
