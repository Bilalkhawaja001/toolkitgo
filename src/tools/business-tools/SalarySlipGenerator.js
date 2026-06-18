import React, { useEffect, useMemo, useState } from 'react';
import BusinessDocShell from './BusinessDocShell';
import {
  createDoc, drawDocHeader, drawPartyBlock, drawTable, drawTotalsBlock,
  drawFooterDisclaimer, downloadPdf, money, parseNum, safeFilename,
  loadDraft, saveDraft, clearDraft
} from './businessPdfUtils';

const SLUG = 'salary-slip-generator';
const thisMonth = new Date().toISOString().slice(0, 7);
const INITIAL = {
  company: '', empName: '', empId: '', department: '', designation: '', month: thisMonth,
  basic: '', house: '', transport: '', otherAllowance: '',
  advance: '', loan: '', otherDeduction: '', preparedBy: ''
};

function SalarySlipGenerator() {
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

  const totals = useMemo(() => {
    const earnings = parseNum(form.basic) + parseNum(form.house) + parseNum(form.transport) + parseNum(form.otherAllowance);
    const deductions = parseNum(form.advance) + parseNum(form.loan) + parseNum(form.otherDeduction);
    return { gross: earnings, deductions, net: earnings - deductions };
  }, [form]);

  const validate = () => {
    if (!form.company.trim()) return 'Company name required hai.';
    if (!form.empName.trim()) return 'Employee name required hai.';
    if (!form.month.trim()) return 'Month required hai.';
    if (parseNum(form.basic) <= 0) return 'Basic salary 0 se zyada hona chahiye.';
    return '';
  };

  const download = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const doc = createDoc();
    let y = drawDocHeader(doc, {
      title: 'Salary Slip',
      leftLines: [form.company],
      rightLines: [`Month: ${form.month}`]
    });
    const yLeft = drawPartyBlock(doc, 40, y, 'Employee', [
      form.empName,
      form.empId ? `ID: ${form.empId}` : '',
      form.designation
    ]);
    const yRight = drawPartyBlock(doc, 320, y, 'Department', [form.department || '-']);
    y = Math.max(yLeft, yRight) + 8;
    const body = [
      ['Basic salary', money(form.basic), ''],
      ['House allowance', money(form.house), ''],
      ['Transport allowance', money(form.transport), ''],
      ['Other allowance', money(form.otherAllowance), ''],
      ['Advance deduction', '', money(form.advance)],
      ['Loan deduction', '', money(form.loan)],
      ['Other deduction', '', money(form.otherDeduction)]
    ];
    y = drawTable(doc, {
      head: [['Component', 'Earnings', 'Deductions']],
      body,
      startY: y,
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } }
    });
    y = drawTotalsBlock(doc, y + 20, [
      { label: 'Gross salary', value: money(totals.gross) },
      { label: 'Total deductions', value: money(totals.deductions) },
      { label: 'Net salary', value: money(totals.net), bold: true }
    ]);
    drawPartyBlock(doc, 40, y + 20, 'Prepared By', [form.preparedBy || '-']);
    drawFooterDisclaimer(doc, 'Generated locally. Verify before official use.');
    downloadPdf(doc, safeFilename(`salary-slip-${form.empName}-${form.month}`, 'salary-slip'));
  };

  const clearAll = () => {
    clearDraft(SLUG);
    setForm(INITIAL);
    setError('');
  };

  return (
    <BusinessDocShell
      toolId={SLUG}
      title="Salary Slip Generator"
      subtitle="Client-side A4 payroll slip via jsPDF + autoTable. Generated locally. Verify before official use."
      error={error}
      onDownload={download}
      onClear={clearAll}
    >
      <div className="simple-form-grid">
        <label>Company name<input className="form-input" value={form.company} onChange={(e) => set('company', e.target.value)} /></label>
        <label>Employee name<input className="form-input" value={form.empName} onChange={(e) => set('empName', e.target.value)} /></label>
        <label>Employee ID<input className="form-input" value={form.empId} onChange={(e) => set('empId', e.target.value)} /></label>
        <label>Department<input className="form-input" value={form.department} onChange={(e) => set('department', e.target.value)} /></label>
        <label>Designation<input className="form-input" value={form.designation} onChange={(e) => set('designation', e.target.value)} /></label>
        <label>Month<input className="form-input" type="month" value={form.month} onChange={(e) => set('month', e.target.value)} /></label>
      </div>
      <div className="simple-form-grid">
        <label>Basic salary<input className="form-input" type="number" min="0" value={form.basic} onChange={(e) => set('basic', e.target.value)} /></label>
        <label>House allowance<input className="form-input" type="number" min="0" value={form.house} onChange={(e) => set('house', e.target.value)} /></label>
        <label>Transport allowance<input className="form-input" type="number" min="0" value={form.transport} onChange={(e) => set('transport', e.target.value)} /></label>
        <label>Other allowance<input className="form-input" type="number" min="0" value={form.otherAllowance} onChange={(e) => set('otherAllowance', e.target.value)} /></label>
        <label>Advance deduction<input className="form-input" type="number" min="0" value={form.advance} onChange={(e) => set('advance', e.target.value)} /></label>
        <label>Loan deduction<input className="form-input" type="number" min="0" value={form.loan} onChange={(e) => set('loan', e.target.value)} /></label>
        <label>Other deduction<input className="form-input" type="number" min="0" value={form.otherDeduction} onChange={(e) => set('otherDeduction', e.target.value)} /></label>
        <label>Prepared by<input className="form-input" value={form.preparedBy} onChange={(e) => set('preparedBy', e.target.value)} /></label>
      </div>
      <div className="result-card-grid">
        <div><span>Gross salary</span><strong>{money(totals.gross)}</strong></div>
        <div><span>Total deductions</span><strong>{money(totals.deductions)}</strong></div>
        <div><span>Net salary</span><strong>{money(totals.net)}</strong></div>
      </div>
    </BusinessDocShell>
  );
}

export default SalarySlipGenerator;
