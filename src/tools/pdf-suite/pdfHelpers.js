import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';

export const PDF_MAX_SIZE = 50 * 1024 * 1024;
export const IMAGE_MAX_SIZE = 20 * 1024 * 1024;
export const OFFICE_MAX_SIZE = 20 * 1024 * 1024;
export const CARD_MM = { width: 85.6, height: 53.98 };

export const OFFICE_TO_PDF_SPECS = {
  'word-to-pdf': {
    type: 'word',
    label: 'Word document',
    extensions: ['.doc', '.docx'],
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  'excel-to-pdf': {
    type: 'excel',
    label: 'Excel spreadsheet',
    extensions: ['.xls', '.xlsx'],
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },
  'powerpoint-to-pdf': {
    type: 'powerpoint',
    label: 'PowerPoint presentation',
    extensions: ['.ppt', '.pptx'],
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  }
};

export const getOfficeAccept = (toolId) => {
  const spec = OFFICE_TO_PDF_SPECS[toolId];
  return spec ? [...spec.extensions, ...spec.mimeTypes].join(',') : '';
};

export const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

export const safeErrorMessage = (error) => error?.message || 'Something went wrong while processing the file.';

export const downloadBlob = (blob, filename) => ({ url: URL.createObjectURL(blob), filename, size: blob.size });

export const validatePdfFile = (file) => {
  if (!file) return 'Upload a PDF file first.';
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return 'Unsupported file type. Please upload a PDF.';
  if (file.size > PDF_MAX_SIZE) return 'PDF is too large. Maximum size is 50MB.';
  return '';
};

export const validateImageFile = (file) => {
  if (!file) return 'Upload an image first.';
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Unsupported image type. Use JPG, PNG, or WEBP.';
  if (file.size > IMAGE_MAX_SIZE) return 'Image is too large. Maximum size is 20MB.';
  return '';
};

export const validateOfficeFile = (file, toolId) => {
  const spec = OFFICE_TO_PDF_SPECS[toolId];
  if (!spec) return 'Unsupported Office to PDF route.';
  if (!file) return `Upload a ${spec.label} first.`;
  const lower = file.name.toLowerCase();
  const hasExtension = spec.extensions.some(ext => lower.endsWith(ext));
  const hasMime = file.type && spec.mimeTypes.includes(file.type);
  if (!hasExtension && !hasMime) return `Unsupported file type. Use ${spec.extensions.join(', ')}.`;
  if (file.size > OFFICE_MAX_SIZE) return 'Office file is too large. Maximum size is 20MB.';
  return '';
};

export const loadPdfBytes = async (file) => new Uint8Array(await file.arrayBuffer());

export const parsePageSelection = (input, totalPages) => {
  const selected = new Set();
  if (!input.trim()) return [];
  input.split(',').map(part => part.trim()).filter(Boolean).forEach((part) => {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(n => Number(n.trim()));
      if (Number.isInteger(a) && Number.isInteger(b)) {
        const start = Math.max(1, Math.min(a, b));
        const end = Math.min(totalPages, Math.max(a, b));
        for (let i = start; i <= end; i += 1) selected.add(i - 1);
      }
    } else {
      const page = Number(part);
      if (Number.isInteger(page) && page >= 1 && page <= totalPages) selected.add(page - 1);
    }
  });
  return [...selected].sort((a, b) => a - b);
};

export const copyPagesToNewPdf = async (sourcePdf, indexes) => {
  const output = await PDFDocument.create();
  const pages = await output.copyPages(sourcePdf, indexes);
  pages.forEach(page => output.addPage(page));
  return output;
};

export const createZip = async (files) => {
  const zip = new JSZip();
  files.forEach(file => zip.file(file.name, file.blob));
  return zip.generateAsync({ type: 'blob' });
};

export const loadPdfJsDocument = async (file) => {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.js`;
  const data = await file.arrayBuffer();
  return pdfjsLib.getDocument({ data, disableWorker: true }).promise;
};

export const renderPdfPageToCanvas = async (pdf, pageNumber, scale = 1.5, grayscale = false) => {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  await page.render({ canvasContext: ctx, viewport }).promise;
  if (grayscale) cleanScanCanvas(canvas, 'grayscale');
  return canvas;
};

export const extractPdfText = async (file) => {
  const pdf = await loadPdfJsDocument(file);
  const pages = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  return pages;
};

export const canvasToBlob = (canvas, mime = 'image/png', quality = 0.92) => new Promise((resolve) => canvas.toBlob(resolve, mime, quality));

export const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Could not read the image.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('Could not load the image.'));
    image.onload = () => resolve({ image, dataUrl: reader.result, width: image.naturalWidth, height: image.naturalHeight });
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export const getOriginalImageDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Could not read the image.'));
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(file);
});

export const cleanScanCanvas = (canvas, mode = 'clean') => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let total = 0;
  for (let i = 0; i < data.length; i += 4) total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  const avg = total / (data.length / 4);
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    let out = gray;
    if (mode === 'bw') out = gray < Math.max(135, avg * 0.9) ? 0 : 255;
    else if (mode === 'grayscale') out = gray;
    else if (mode === 'contrast') out = Math.max(0, Math.min(255, (gray - 128) * 1.65 + 128));
    else if (mode === 'ink') out = gray < 90 ? Math.min(80, gray + 20) : Math.min(255, gray + 42);
    else out = gray < avg * 0.72 ? Math.max(0, gray - 35) : Math.min(255, gray + (245 - avg) * 0.9);
    data[i] = out; data[i + 1] = out; data[i + 2] = out; data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export const calculateFitRect = (pageWidth, pageHeight, imageWidth, imageHeight, margin = 10) => {
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;
  const ratio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
  const width = imageWidth * ratio;
  const height = imageHeight * ratio;
  return { x: (pageWidth - width) / 2, y: (pageHeight - height) / 2, width, height };
};

export const addPdfPageImage = (pdf, imageData, format, pageWidth, pageHeight, rect) => {
  pdf.addImage(imageData, format, rect.x, rect.y, rect.width, rect.height);
};

export const imageFilesToPdfBlob = async (files, options = {}) => {
  const { qualityMode = 'a4', enhancementMode = 'original', pageSize = 'a4', orientation = 'portrait', jpegQuality = 0.82, documentType = 'full-a4', backFile = null, labels = true } = options;
  const pdf = new jsPDF({ unit: 'mm', format: pageSize === 'letter' ? 'letter' : 'a4', orientation });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const allFiles = documentType === 'front-back-a4' && backFile ? [files[0], backFile] : files;
  for (let index = 0; index < allFiles.length; index += 1) {
    const file = allFiles[index];
    const { image, dataUrl, width, height } = await loadImageFromFile(file);
    let imageData = dataUrl;
    let format = file.type === 'image/png' ? 'PNG' : 'JPEG';
    let targetW = pageW;
    let targetH = pageH;
    let rect;

    if (index > 0 && documentType !== 'front-back-a4') pdf.addPage();

    if (enhancementMode !== 'original' || qualityMode === 'small') {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (file.type !== 'image/png' || qualityMode === 'small') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height); }
      ctx.drawImage(image, 0, 0);
      if (enhancementMode !== 'original') cleanScanCanvas(canvas, enhancementMode);
      const mime = qualityMode === 'small' ? 'image/jpeg' : 'image/png';
      imageData = canvas.toDataURL(mime, qualityMode === 'small' ? jpegQuality : undefined);
      format = mime === 'image/png' ? 'PNG' : 'JPEG';
    }

    if (documentType === 'actual-card') {
      rect = calculateFitRect(CARD_MM.width + 20, CARD_MM.height + 20, width, height, 10);
      if (index === 0) { pdf.deletePage(1); pdf.addPage([CARD_MM.width + 20, CARD_MM.height + 20], 'landscape'); }
      addPdfPageImage(pdf, imageData, format, CARD_MM.width + 20, CARD_MM.height + 20, rect);
      continue;
    }

    if (documentType === 'front-back-a4') {
      if (index === 0) pdf.setPage(1);
      const cardW = CARD_MM.width;
      const cardH = CARD_MM.height;
      const x = (pageW - cardW) / 2;
      const y = index === 0 ? 55 : 150;
      const fit = calculateFitRect(cardW, cardH, width, height, 0);
      addPdfPageImage(pdf, imageData, format, cardW, cardH, { x: x + fit.x, y: y + fit.y, width: fit.width, height: fit.height });
      if (labels) { pdf.setFontSize(10); pdf.text(index === 0 ? 'Front' : 'Back', x, y - 4); }
      continue;
    }

    if (qualityMode === 'original') {
      targetW = width * 0.264583;
      targetH = height * 0.264583;
      if (index === 0) { pdf.deletePage(1); pdf.addPage([targetW, targetH], targetW >= targetH ? 'landscape' : 'portrait'); }
      rect = { x: 0, y: 0, width: targetW, height: targetH };
    } else {
      rect = calculateFitRect(pageW, pageH, width, height, 10);
    }
    addPdfPageImage(pdf, imageData, format, targetW, targetH, rect);
  }
  const blob = pdf.output('blob');
  if (!blob || blob.size === 0) throw new Error('PDF generation failed. Output was empty.');
  return blob;
};

export const addTextToPdfPages = async (file, options) => {
  const pdfDoc = await PDFDocument.load(await loadPdfBytes(file), { ignoreEncryption: false });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    if (options.type === 'numbers') {
      if (options.skipFirst && idx === 0) return;
      const text = String((options.start || 1) + idx);
      page.drawText(text, { x: width / 2, y: 24, size: options.fontSize || 12, font, color: rgb(0, 0, 0) });
    } else if (options.type === 'watermark') {
      page.drawText(options.text || 'Watermark', { x: width * 0.22, y: height * 0.5, size: options.fontSize || 44, font, color: rgb(0.55, 0.55, 0.55), rotate: degrees(options.rotation || 35), opacity: options.opacity || 0.25 });
    } else if (options.type === 'headerFooter') {
      if (options.header) page.drawText(options.header, { x: 36, y: height - 28, size: options.fontSize || 10, font, color: rgb(0, 0, 0) });
      if (options.footer) page.drawText(options.footer.replace('{page}', String(idx + 1)), { x: 36, y: 20, size: options.fontSize || 10, font, color: rgb(0, 0, 0) });
    }
  });
  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
};
