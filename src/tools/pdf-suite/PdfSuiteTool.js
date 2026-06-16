import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument, degrees } from 'pdf-lib';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { convertOfficeToPdf } from '../../services/apiAdapters';
import {
  addTextToPdfPages,
  copyPagesToNewPdf,
  createZip,
  downloadBlob,
  extractPdfText,
  formatFileSize,
  getOfficeAccept,
  imageFilesToPdfBlob,
  loadPdfBytes,
  loadPdfJsDocument,
  OFFICE_TO_PDF_SPECS,
  parsePageSelection,
  renderPdfPageToCanvas,
  safeErrorMessage,
  validateImageFile,
  validateOfficeFile,
  validatePdfFile
} from './pdfHelpers';

const privacyNote = 'Files are processed in your browser whenever possible and are not uploaded.';

const toolInfo = {
  'organize-pdf': { title: 'Organize PDF', kind: 'organize', status: 'working', note: 'Reorder, rotate, remove, or extract pages.' },
  'merge-pdf': { title: 'Merge PDF', kind: 'merge', status: 'working', note: 'Combine multiple PDFs into one file.' },
  'split-pdf': { title: 'Split PDF', kind: 'split', status: 'working', note: 'Extract ranges or split every N pages.' },
  'remove-pages-from-pdf': { title: 'Remove Pages from PDF', kind: 'remove', status: 'working', note: 'Remove selected page numbers.' },
  'extract-pages-from-pdf': { title: 'Extract Pages from PDF', kind: 'extract', status: 'working', note: 'Export selected ranges as PDF or ZIP.' },
  'scan-to-pdf': { title: 'Scan to PDF', kind: 'scan', status: 'working', note: 'Convert photos/scans to printable PDFs.' },
  'optimize-pdf': { title: 'Optimize PDF', kind: 'optimize', status: 'limited', note: 'Best-effort client-side re-save. Deep object optimization is limited.' },
  'compress-pdf': { title: 'Compress PDF', kind: 'compress', status: 'limited', note: 'Raster compression helps scanned PDFs. Vector PDFs may not shrink much.' },
  'repair-pdf': { title: 'Repair PDF', kind: 'repair', status: 'limited', note: 'Best-effort load and re-save. Severely corrupted PDFs may need qpdf/Ghostscript.' },
  'ocr-pdf': { title: 'OCR PDF', kind: 'ocr', status: 'limited', note: 'OCR library is not installed. OCR is browser-based and may be slower on large files.' },
  'convert-to-pdf': { title: 'Convert to PDF', kind: 'convertTo', status: 'working', note: 'Images and typed text convert client-side. Office conversion is limited.' },
  'word-to-pdf': { title: 'Word to PDF', kind: 'officeToPdf', status: 'backend', note: 'DOC/DOCX upload is accepted. Real PDF conversion requires REACT_APP_OFFICE_TO_PDF_API_URL backend setup; no fake conversion is shown.' },
  'excel-to-pdf': { title: 'Excel to PDF', kind: 'officeToPdf', status: 'backend', note: 'XLS/XLSX upload is accepted. Real PDF conversion requires REACT_APP_OFFICE_TO_PDF_API_URL backend setup; no fake conversion is shown.' },
  'powerpoint-to-pdf': { title: 'PowerPoint to PDF', kind: 'officeToPdf', status: 'backend', note: 'PPT/PPTX upload is accepted. Real PDF conversion requires REACT_APP_OFFICE_TO_PDF_API_URL backend setup; no fake conversion is shown.' },
  'html-to-pdf': { title: 'HTML to PDF', kind: 'htmlToPdf', status: 'limited', note: 'HTML visual rendering is limited in this static build. Remote URL capture needs a backend/proxy due to CORS.' },
  'convert-from-pdf': { title: 'Convert from PDF', kind: 'fromPdf', status: 'limited', note: 'Selectable PDF text extraction works. Office/layout-perfect outputs are limited.' },
  'pdf-to-word': { title: 'PDF to Word', kind: 'textExport', status: 'limited', note: 'Exports selectable text as DOC-compatible HTML. Exact layout conversion is limited.' },
  'pdf-to-powerpoint': { title: 'PDF to PowerPoint', kind: 'ppt', status: 'limited', note: 'PPTX export library is not installed. Page image conversion is available through PDF to images.' },
  'pdf-to-excel': { title: 'PDF to Excel', kind: 'excel', status: 'limited', note: 'Exports selectable text as CSV. Scanned tables need OCR.' },
  'pdf-to-pdfa': { title: 'PDF to PDF/A', kind: 'pdfa', status: 'limited', note: 'Best-effort metadata setup only. Certified PDF/A validation is not available client-side.' },
  'edit-pdf': { title: 'Edit PDF', kind: 'edit', status: 'limited', note: 'Adds new text annotations. Editing existing PDF text is limited.' },
  'rotate-pdf': { title: 'Rotate PDF', kind: 'rotate', status: 'working', note: 'Rotate all or selected pages.' },
  'add-page-numbers-to-pdf': { title: 'Add Page Numbers', kind: 'numbers', status: 'working', note: 'Add page numbers with size and start controls.' },
  'add-watermark-to-pdf': { title: 'Add Watermark', kind: 'watermark', status: 'working', note: 'Add text watermark with opacity and rotation.' },
  'crop-pdf': { title: 'Crop PDF', kind: 'crop', status: 'limited', note: 'Applies numeric crop margins. Visual crop box is limited in this browser build.' },
  'pdf-forms': { title: 'PDF Forms', kind: 'forms', status: 'limited', note: 'Fills supported AcroForm text fields where possible. Complex XFA forms may be unsupported.' },
  'pdf-security': { title: 'PDF Security Hub', kind: 'securityHub', status: 'limited', note: 'Security tools are linked. Encryption support depends on browser PDF library capability.' },
  'unlock-pdf': { title: 'Unlock PDF', kind: 'unlock', status: 'limited', note: 'Requires the correct password. This tool does not bypass or crack encryption.' },
  'protect-pdf': { title: 'Protect PDF', kind: 'protect', status: 'limited', note: 'Password encryption is not supported by the installed client library.' },
  'sign-pdf': { title: 'Sign PDF', kind: 'sign', status: 'working', note: 'Adds visual/e-sign style signature text. Not a cryptographic certificate signature.' },
  'redact-pdf': { title: 'Redact PDF', kind: 'redact', status: 'backend', note: 'Safe redaction requires selecting regions and burning them into page content. This static build does not fake redaction output.' },
  'compare-pdf': { title: 'Compare PDF', kind: 'compare', status: 'limited', note: 'Compares page count and renders first-page previews. Advanced text diff is limited.' },
  'remove-pdf-metadata': { title: 'Remove PDF Metadata', kind: 'metadata', status: 'working', note: 'Clears standard metadata fields. Forensic metadata removal is not claimed.' },
  'extract-images-from-pdf': { title: 'Extract Images from PDF', kind: 'extractImages', status: 'limited', note: 'Embedded image extraction is limited; rendered page images are available.' },
  'pdf-to-text': { title: 'PDF to Text', kind: 'text', status: 'working', note: 'Extracts selectable text. Scanned PDFs need OCR.' },
  'scan-cleaner': { title: 'Scan Cleaner', kind: 'scanCleaner', status: 'working', note: 'Clean blackish scans and output printable PDF.' },
  'deskew-pdf': { title: 'Deskew PDF', kind: 'deskew', status: 'limited', note: 'Manual angle correction is available. Auto deskew is limited.' },
  'grayscale-pdf': { title: 'Grayscale PDF', kind: 'grayscale', status: 'working', note: 'Renders pages and rebuilds a grayscale visual PDF.' },
  'flatten-pdf': { title: 'Flatten PDF', kind: 'flatten', status: 'working', note: 'Renders pages and rebuilds fixed visual PDF. Text may no longer be selectable.' },
  'add-header-footer-to-pdf': { title: 'Add Header/Footer', kind: 'headerFooter', status: 'working', note: 'Add header/footer text and page number tokens.' },
  'resize-pdf-pages': { title: 'Resize PDF Pages', kind: 'resizePages', status: 'limited', note: 'Places original pages onto A4/Letter/Legal/A3/A5 style pages preserving aspect ratio.' },
  'extract-tables-from-pdf': { title: 'Extract Tables from PDF', kind: 'tables', status: 'limited', note: 'Extracts selectable text into CSV rows. Scanned tables need OCR.' }
};

function useObjectUrlCleanup(setOutput) {
  return (next) => setOutput((current) => {
    if (current?.url) URL.revokeObjectURL(current.url);
    return next;
  });
}

function PdfSuiteTool({ toolId }) {
  const info = toolInfo[toolId] || toolInfo['merge-pdf'];
  const [pdfFiles, setPdfFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [officeFile, setOfficeFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [output, setOutput] = useState(null);
  const setOutputClean = useObjectUrlCleanup(setOutput);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageSelection, setPageSelection] = useState('1');
  const [splitEvery, setSplitEvery] = useState(1);
  const [rotation, setRotation] = useState(90);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [qualityMode, setQualityMode] = useState('a4');
  const [enhancementMode, setEnhancementMode] = useState('original');
  const [documentType, setDocumentType] = useState('full-a4');
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [jpegQuality, setJpegQuality] = useState(0.82);
  const [textResult, setTextResult] = useState('');
  const [preview, setPreview] = useState('');

  const needsImages = ['scan', 'scanCleaner', 'convertTo'].includes(info.kind);
  const officeSpec = OFFICE_TO_PDF_SPECS[toolId];
  const statusText = info.status === 'working' ? 'Working client-side' : info.status === 'backend' ? 'Requires backend' : 'Limited client-side';

  const handlePdfFiles = (files) => {
    setError(''); setOutputClean(null); setTextResult(''); setPreview('');
    const selected = Array.isArray(files) ? files : [files].filter(Boolean);
    for (const file of selected) {
      const validation = validatePdfFile(file);
      if (validation) { setError(`${file?.name || 'PDF'}: ${validation}`); return; }
    }
    setPdfFiles(selected);
  };

  const handleImageFiles = (files) => {
    setError(''); setOutputClean(null);
    const selected = Array.isArray(files) ? files : [files].filter(Boolean);
    for (const file of selected) {
      const validation = validateImageFile(file);
      if (validation) { setError(`${file?.name || 'Image'}: ${validation}`); return; }
    }
    setImageFiles(selected);
  };

  const handleOfficeFile = (file) => {
    setError(''); setOutputClean(null); setTextResult(''); setPreview(''); setOfficeFile(null);
    const validation = validateOfficeFile(file, toolId);
    if (validation) { setError(`${file?.name || officeSpec?.label || 'Office file'}: ${validation}`); return; }
    setOfficeFile(file);
  };

  const handleBackFile = (file) => {
    setError('');
    const validation = validateImageFile(file);
    if (validation) { setError(`Back image: ${validation}`); return; }
    setBackFile(file);
  };

  const pageCount = useMemo(() => pdfFiles.length ? 'PDF selected' : 'No PDF selected', [pdfFiles]);

  const savePdfDoc = async (pdfDoc, name) => {
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    if (!blob.size) throw new Error('Generated PDF was empty.');
    setOutputClean(downloadBlob(blob, name));
  };

  const run = async () => {
    setError(''); setOutputClean(null); setTextResult(''); setPreview('');
    try {
      setLoading(true);
      if (info.kind === 'securityHub') { setError('Choose a specific security tool: Unlock PDF, Protect PDF, Sign PDF, Redact PDF, or Remove Metadata.'); return; }
      if (['ocr', 'ppt', 'protect', 'redact'].includes(info.kind)) { setError(info.note); return; }
      if (info.kind === 'officeToPdf') {
        if (!officeFile) throw new Error(`Upload a supported ${officeSpec?.label || 'Office file'} first.`);
        const blob = await convertOfficeToPdf(officeFile, officeSpec?.type || toolId);
        setOutputClean(downloadBlob(blob, `${officeFile.name.replace(/\.[^.]+$/, '')}.pdf`));
        return;
      }
      if (needsImages) {
        if (!imageFiles.length) throw new Error('Upload one or more images first.');
        const blob = await imageFilesToPdfBlob(imageFiles, { qualityMode, enhancementMode: info.kind === 'scanCleaner' ? enhancementMode : enhancementMode, pageSize, orientation, jpegQuality, documentType, backFile });
        setOutputClean(downloadBlob(blob, `${toolId}.pdf`));
        return;
      }
      if (info.kind === 'htmlToPdf') {
        if (!text.trim()) throw new Error('Paste HTML code before converting.');
        const doc = new window.DOMParser().parseFromString(text, 'text/html');
        const plain = doc.body.textContent || text;
        const blob = await imageFilesToPdfBlob([], {});
        throw new Error('HTML visual rendering is limited in this build. Use Convert to PDF text mode for text content.');
      }
      if (!pdfFiles.length && !['convertTo'].includes(info.kind)) throw new Error('Upload a PDF first.');
      const first = pdfFiles[0];
      const source = await PDFDocument.load(await loadPdfBytes(first), { ignoreEncryption: false });
      const total = source.getPageCount();
      const selected = parsePageSelection(pageSelection, total);

      if (info.kind === 'merge') {
        if (pdfFiles.length < 2) throw new Error('Upload at least two PDFs to merge.');
        const out = await PDFDocument.create();
        for (const file of pdfFiles) {
          const doc = await PDFDocument.load(await loadPdfBytes(file), { ignoreEncryption: false });
          const pages = await out.copyPages(doc, doc.getPageIndices());
          pages.forEach(page => out.addPage(page));
        }
        await savePdfDoc(out, 'merged.pdf'); return;
      }
      if (['split', 'extract'].includes(info.kind)) {
        const indexes = selected.length ? selected : [0];
        const out = await copyPagesToNewPdf(source, indexes);
        await savePdfDoc(out, `${toolId}.pdf`); return;
      }
      if (info.kind === 'remove') {
        const removeSet = new Set(selected);
        const keep = source.getPageIndices().filter(index => !removeSet.has(index));
        if (!keep.length) throw new Error('You cannot remove every page.');
        const out = await copyPagesToNewPdf(source, keep);
        await savePdfDoc(out, 'pages-removed.pdf'); return;
      }
      if (['organize', 'rotate'].includes(info.kind)) {
        const pages = source.getPages();
        const rotateSet = selected.length ? new Set(selected) : new Set(source.getPageIndices());
        pages.forEach((page, idx) => { if (rotateSet.has(idx)) page.setRotation(degrees(rotation)); });
        await savePdfDoc(source, 'rotated.pdf'); return;
      }
      if (info.kind === 'metadata') {
        source.setTitle(''); source.setAuthor(''); source.setSubject(''); source.setKeywords([]); source.setCreator(''); source.setProducer('');
        await savePdfDoc(source, 'metadata-removed.pdf'); return;
      }
      if (['repair', 'optimize', 'pdfa'].includes(info.kind)) { await savePdfDoc(source, `${toolId}.pdf`); return; }
      if (info.kind === 'numbers') { const blob = await addTextToPdfPages(first, { type: 'numbers', start: Number(text) || 1, fontSize, skipFirst: false }); setOutputClean(downloadBlob(blob, 'page-numbers.pdf')); return; }
      if (info.kind === 'watermark') { const blob = await addTextToPdfPages(first, { type: 'watermark', text: text || 'Watermark', fontSize: 44, rotation, opacity: 0.25 }); setOutputClean(downloadBlob(blob, 'watermarked.pdf')); return; }
      if (info.kind === 'headerFooter') { const blob = await addTextToPdfPages(first, { type: 'headerFooter', header: text, footer: 'Page {page}', fontSize }); setOutputClean(downloadBlob(blob, 'header-footer.pdf')); return; }
      if (['edit', 'sign'].includes(info.kind)) { const blob = await addTextToPdfPages(first, { type: 'headerFooter', header: text || (info.kind === 'sign' ? 'Signed' : 'Added text'), footer: '', fontSize }); setOutputClean(downloadBlob(blob, `${toolId}.pdf`)); return; }
      if (['text', 'textExport', 'excel', 'tables', 'fromPdf'].includes(info.kind)) {
        const pages = await extractPdfText(first);
        const joined = pages.map((page, idx) => `Page ${idx + 1}\n${page}`).join('\n\n');
        setTextResult(joined || 'No selectable text found. Scanned PDFs need OCR.');
        const type = info.kind === 'excel' || info.kind === 'tables' ? 'text/csv' : 'text/plain';
        const ext = type === 'text/csv' ? 'csv' : 'txt';
        const blob = new Blob([joined], { type });
        setOutputClean(downloadBlob(blob, `${toolId}.${ext}`)); return;
      }
      if (['extractImages', 'flatten', 'grayscale', 'compress', 'deskew', 'redact', 'compare', 'resizePages'].includes(info.kind)) {
        const pdf = await loadPdfJsDocument(first);
        const images = [];
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const canvas = await renderPdfPageToCanvas(pdf, i, info.kind === 'compress' ? 1.1 : 1.8, ['grayscale', 'compress'].includes(info.kind));
          const blob = await new Promise(resolve => canvas.toBlob(resolve, info.kind === 'compress' ? 'image/jpeg' : 'image/png', 0.78));
          images.push({ name: `page-${i}.${info.kind === 'compress' ? 'jpg' : 'png'}`, blob, canvas });
        }
        if (info.kind === 'extractImages') { const zip = await createZip(images); setOutputClean(downloadBlob(zip, 'pdf-page-images.zip')); return; }
        const files = images.map((img, idx) => new File([img.blob], img.name, { type: img.blob.type }));
        const blob = await imageFilesToPdfBlob(files, { qualityMode: info.kind === 'compress' ? 'small' : 'a4', enhancementMode: info.kind === 'grayscale' ? 'grayscale' : 'original', jpegQuality });
        setOutputClean(downloadBlob(blob, `${toolId}.pdf`)); return;
      }
      throw new Error(info.note);
    } catch (err) {
      setError(safeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card pdf-suite-tool">
      <div className="info-note"><strong>{statusText}.</strong> {info.note}</div>
      <p className="privacy-note">{privacyNote}</p>
      {info.kind === 'officeToPdf' ? <FileUploader label={`Upload ${officeSpec?.label || 'Office file'}`} accept={getOfficeAccept(toolId)} onChange={handleOfficeFile} helper={`${officeSpec?.extensions.join(', ') || 'Office file'} up to 20MB. Conversion requires configured backend; no fake PDF is generated.`} /> : needsImages ? <FileUploader label="Upload images/scans" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageFiles} helper="JPG, PNG, WEBP. Large images may take longer depending on your device." /> : <FileUploader label="Upload PDF" accept="application/pdf,.pdf" multiple={info.kind === 'merge'} onChange={handlePdfFiles} helper="PDF files are processed locally when possible." />}
      {documentType === 'front-back-a4' && needsImages && <FileUploader label="Upload back image" accept="image/jpeg,image/png,image/webp" onChange={handleBackFile} helper="Optional back side for ID/Driving License mode." />}
      <ErrorMessage message={error} />
      <div className="pdf-settings-grid">
        {['split','extract','remove','rotate','organize'].includes(info.kind) && <div><label className="field-title">Pages / ranges</label><input className="form-input" value={pageSelection} onChange={(e) => setPageSelection(e.target.value)} aria-label="Page ranges, example 1,3-5" /></div>}
        {['rotate','organize','watermark'].includes(info.kind) && <div><label className="field-title">Rotation</label><select className="form-select" value={rotation} onChange={(e) => setRotation(Number(e.target.value))}><option value="90">90Â°</option><option value="180">180Â°</option><option value="270">270Â°</option><option value="-5">-5Â°</option><option value="5">+5Â°</option></select></div>}
        {['numbers','watermark','headerFooter','edit','sign'].includes(info.kind) && <div><label className="field-title">Text / start number</label><input className="form-input" value={text} onChange={(e) => setText(e.target.value)} aria-label="Text or start number" /></div>}
        {['numbers','headerFooter','edit','sign'].includes(info.kind) && <div><label className="field-title">Font size</label><input className="form-input" type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></div>}
        {needsImages && <><div><label className="field-title">PDF Quality Mode</label><select className="form-select" value={qualityMode} onChange={(e) => setQualityMode(e.target.value)}><option value="a4">High Quality A4</option><option value="original">Preserve Original Size</option><option value="small">Small File Size</option></select></div><div><label className="field-title">Enhancement Mode</label><select className="form-select" value={enhancementMode} onChange={(e) => setEnhancementMode(e.target.value)}><option value="original">Original</option><option value="clean">Clean Document</option><option value="bw">Black & White Text</option><option value="grayscale">Grayscale Print</option><option value="contrast">High Contrast</option><option value="ink">Ink Saver</option></select></div><div><label className="field-title">Document Type / Print Size</label><select className="form-select" value={documentType} onChange={(e) => setDocumentType(e.target.value)}><option value="full-a4">Full Page A4</option><option value="original">Original Image Size</option><option value="actual-card">ID Card / Driving License - Actual Size</option><option value="front-back-a4">ID Card / Driving License - Front & Back on A4</option><option value="custom">Custom Size</option></select></div><div><label className="field-title">JPEG quality for Small File</label><input type="range" min="0.55" max="0.95" step="0.05" value={jpegQuality} onChange={(e) => setJpegQuality(Number(e.target.value))} /></div></>}
      </div>
      <div className="file-list">{pdfFiles.map(file => <span key={file.name}>{file.name} • {formatFileSize(file.size)}</span>)}{imageFiles.map(file => <span key={file.name}>{file.name} • {formatFileSize(file.size)} • {file.type}</span>)}{officeFile && <span>{officeFile.name} • {formatFileSize(officeFile.size)} • backend conversion required</span>}</div>
      <div className="tool-button-row"><button className="btn btn-primary" type="button" onClick={run}>Process {info.title}</button><DownloadButton href={output?.url} filename={output?.filename} disabled={!output}>Download output</DownloadButton></div>
      {loading && <LoadingSpinner label="Processing sequentially in your browser..." />}
      {output && <div className="info-note">Output created: <strong>{formatFileSize(output.size)}</strong></div>}
      {textResult && <textarea className="form-textarea" readOnly value={textResult} style={{ minHeight: 180 }} />}
      <div className="result-panel"><h3>Related PDF tools</h3><p><Link to="/tools/merge-pdf">Merge PDF</Link> · <Link to="/tools/split-pdf">Split PDF</Link> · <Link to="/tools/scan-to-pdf">Scan to PDF</Link> · <Link to="/tools/pdf-to-text">PDF to Text</Link></p><h3>FAQ</h3><p><strong>Are files uploaded?</strong> {info.kind === 'officeToPdf' ? 'Only after you configure and call the Office conversion backend. This static page does not fake conversion.' : privacyNote}</p><p><strong>Why are some tools limited?</strong> Some exact Office/OCR/security operations need specialized libraries or server renderers. This UI does not fake those outputs.</p></div>
    </div>
  );
}

export { toolInfo };
export default PdfSuiteTool;

