import React, { useEffect, useState } from 'react';
import BusinessDocShell from './BusinessDocShell';
import {
  createDoc, drawDocHeader, drawPartyBlock, drawTotalsBlock, drawNotes,
  drawFooterDisclaimer, downloadPdf, money, parseNum, formatDate, safeFilename,
  loadDraft, saveDraft, clearDraft
} from './businessPdfUtils';

const SLUG = 'receipt-generator';
const today = new Date().toISOString().slice(0, 10);
const INITIAL = {
  business: '', contact: '', receiptNo: 'RCPT-001', date: today,
  receivedFrom: '', method: 'Cash', amount: '', purpose: '', notes: '', preparedBy: ''
};

function ReceiptGenerator() {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const d = loadDraft(SLUG);
    if (d) setForm((f) => ({ ...f, ...d }));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (JSON.stringify(form) === JSON.stringify(INITIAL)) clearDraft(SLUG);
    else saveDraft(SLUG, form);
  }, [form, loaded]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.business.trim()) return 'Business / company name required hai.';
    if (!form.receiptNo.trim()) return 'Receipt number required hai.';
    if (!form.receivedFrom.trim()) return 'Received from required hai.';
    if (parseNum(form.amount) <= 0) return 'Amount 0 se zyada hona chahiye.';
    return '';
  };

  const download = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const doc = createDoc();
    let y = drawDocHeader(doc, {
      title: 'Payment Receipt',
      leftLines: [form.business, form.contact],
      rightLines: [`Receipt #: ${form.receiptNo}`, `Date: ${formatDate(form.date)}`]
    });
    y = drawPartyBlock(doc, 40, y, 'Received From', [form.receivedFrom]);
    y = drawPartyBlock(doc, 40, y + 6, 'Payment Method', [form.method || 'Cash']);
    y = drawPartyBlock(doc, 40, y + 6, 'For / Purpose', [form.purpose || '-']);
    y = drawTotalsBlock(doc, y + 14, [{ label: 'Amount Received', value: money(form.amount), bold: true }]);
    y = drawNotes(doc, y + 10, 'Notes', form.notes);
    y = drawPartyBlock(doc, 40, y + 20, 'Prepared By', [form.preparedBy || '-']);
    drawFooterDisclaimer(doc, 'Generated locally in your browser. No accounting, tax or legal claim. Verify before official use.');
    downloadPdf(doc, safeFilename(`receipt-${form.receiptNo}`, 'receipt'));
  };

  const clearAll = () => {
    clearDraft(SLUG);
    setForm(INITIAL);
    setError('');
  };

  return (
    <BusinessDocShell
      toolId={SLUG}
      title="Receipt Generator"
      subtitle="Client-side A4 payment receipt via jsPDF. No backend, no payment or accounting claim."
      error={error}
      onDownload={download}
      onClear={clearAll}
    >
      <div className="simple-form-grid">
        <label>Receipt number<input className="form-input" value={form.receiptNo} onChange={(e) => set('receiptNo', e.target.value)} /></label>
        <label>Date<input className="form-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></label>
        <label>Payment method
          <select className="form-select" value={form.method} onChange={(e) => set('method', e.target.value)}>
            <option>Cash</option><option>Bank Transfer</option><option>Card</option><option>Cheque</option><option>Online</option>
          </select>
        </label>
        <label>Amount<input className="form-input" type="number" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} /></label>
      </div>
      <div className="phase1b-two-panel">
        <label>Business / company name<textarea className="form-textarea" value={form.business} onChange={(e) => set('business', e.target.value)} /></label>
        <label>Business address / contact (optional)<textarea className="form-textarea" value={form.contact} onChange={(e) => set('contact', e.target.value)} /></label>
      </div>
      <div className="phase1b-two-panel">
        <label>Received from<textarea className="form-textarea" value={form.receivedFrom} onChange={(e) => set('receivedFrom', e.target.value)} /></label>
        <label>Purpose / description<textarea className="form-textarea" value={form.purpose} onChange={(e) => set('purpose', e.target.value)} /></label>
      </div>
      <div className="phase1b-two-panel">
        <label>Notes (optional)<textarea className="form-textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} /></label>
        <label>Prepared by<input className="form-input" value={form.preparedBy} onChange={(e) => set('preparedBy', e.target.value)} /></label>
      </div>
    </BusinessDocShell>
  );
}

export default ReceiptGenerator;
