import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Module marker (kept as a real string so it survives minification and bundle checks).
export const BUSINESS_PDF_UTILS = 'businessPdfUtils';

// A4 in points (jsPDF unit: 'pt'). Single source of truth so PDFs stay true A4
// on mobile and desktop (no DOM screenshot / html2canvas).
export const A4 = { unit: 'pt', format: 'a4', width: 595.28, height: 841.89, margin: 40 };

export const parseNum = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const money = (value) =>
  parseNum(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toISOString().slice(0, 10);
};

export const safeFilename = (name, fallback = 'document') => {
  const base = String(name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || fallback}.pdf`;
};

// ---- jsPDF document helpers ----

export const createDoc = () => {
  const doc = new jsPDF({ unit: A4.unit, format: A4.format });
  doc.setProperties({ creator: `ToolKitGo ${BUSINESS_PDF_UTILS}`, producer: `ToolKitGo ${BUSINESS_PDF_UTILS}` });
  return doc;
};

export const contentWidth = () => A4.width - A4.margin * 2;

// Title + document number/date header. Returns next y position.
export const drawDocHeader = (doc, { title, leftLines = [], rightLines = [] }) => {
  const { margin } = A4;
  let y = margin + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(String(title || 'Document'), margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 22;
  const startY = y;
  leftLines.filter(Boolean).forEach((line, i) => doc.text(String(line), margin, startY + i * 14));
  rightLines.filter(Boolean).forEach((line, i) => doc.text(String(line), A4.width - margin, startY + i * 14, { align: 'right' }));
  const rows = Math.max(leftLines.filter(Boolean).length, rightLines.filter(Boolean).length);
  y = startY + rows * 14 + 10;
  doc.setDrawColor(200);
  doc.line(margin, y, A4.width - margin, y);
  return y + 18;
};

// Party block (company / customer / vendor / employee). Returns next y position.
export const drawPartyBlock = (doc, x, y, heading, lines = []) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(String(heading), x, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let cy = y + 15;
  lines.filter((l) => l !== undefined && l !== null && String(l).length).forEach((line) => {
    doc.text(String(line), x, cy, { maxWidth: 230 });
    cy += 14;
  });
  return cy;
};

// Wrapper over jspdf-autotable with shared defaults. Returns finalY.
export const drawTable = (doc, { head, body, startY, columnStyles }) => {
  autoTable(doc, {
    head,
    body,
    startY,
    margin: { left: A4.margin, right: A4.margin },
    styles: { fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    columnStyles: columnStyles || {},
    theme: 'grid'
  });
  return doc.lastAutoTable ? doc.lastAutoTable.finalY : startY;
};

// Right-aligned totals block. rows: [{ label, value, bold }]. Returns next y.
export const drawTotalsBlock = (doc, y, rows = []) => {
  const { margin } = A4;
  const right = A4.width - margin;
  const labelX = right - 200;
  let cy = y;
  rows.forEach((row) => {
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.setFontSize(row.bold ? 12 : 10);
    doc.text(String(row.label), labelX, cy);
    doc.text(String(row.value), right, cy, { align: 'right' });
    cy += row.bold ? 20 : 16;
  });
  doc.setFont('helvetica', 'normal');
  return cy;
};

// Multi-line notes/terms. Returns next y.
export const drawNotes = (doc, y, label, text) => {
  if (!text || !String(text).trim()) return y;
  const { margin } = A4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(String(label), margin, y);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(String(text), contentWidth());
  doc.text(lines, margin, y + 14);
  return y + 14 + lines.length * 12 + 6;
};

export const drawFooterDisclaimer = (doc, text) => {
  if (!text) return;
  const { margin } = A4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(String(text), margin, A4.height - 24, { maxWidth: contentWidth() });
  doc.setTextColor(0);
  doc.setFont('helvetica', 'normal');
};

export const pdfBlob = (doc) => doc.output('blob');

export const validatePdfBlob = (blob) => blob instanceof Blob && blob.size > 0;

export const savePdf = (doc, filename) => doc.save(filename);

// Build blob (via output('blob')), validate it, then trigger a download.
// Throws if the generated blob is empty so callers can show an error.
export const downloadPdf = (doc, filename) => {
  const blob = pdfBlob(doc);
  if (!validatePdfBlob(blob)) throw new Error('PDF generation failed (empty output).');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return blob;
};

// ---- localStorage draft helpers (per-tool versioned keys) ----

export const draftKey = (slug) => `toolkitgo_draft_v1_${slug}`;

export const loadDraft = (slug) => {
  try {
    const raw = localStorage.getItem(draftKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveDraft = (slug, data) => {
  try {
    localStorage.setItem(draftKey(slug), JSON.stringify(data));
  } catch {
    /* storage unavailable / quota — ignore, drafts are best-effort */
  }
};

export const clearDraft = (slug) => {
  try {
    localStorage.removeItem(draftKey(slug));
  } catch {
    /* ignore */
  }
};
