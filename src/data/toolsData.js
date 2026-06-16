export const READY_TOOL_IDS = [
  'word-counter',
  'character-counter',
  'case-converter',
  'remove-extra-spaces',
  'text-to-slug',
  'duplicate-line-remover',
  'text-sorter',
  'find-and-replace',
  'emi-calculator',
  'gst-calculator',
  'bmi-calculator',
  'age-calculator',
  'percentage-calculator',
  'unit-converter',
  'date-calculator',
  'json-formatter',
  'base64-encoder',
  'url-encoder',
  'qr-code-generator',
  'image-resize',
  'image-compress',
  'image-converter',
  'image-to-pdf',
  'cnic-id-card-duplex-print',
  'wifi-qr-generator',
  'whatsapp-qr-generator',
  'barcode-generator',
  'vcard-qr-generator',
  'html-encoder',
  'css-minifier',
  'js-minifier',
  'password-generator',
  'lorem-ipsum',
  'invoice-generator',
  'organize-pdf',
  'merge-pdf',
  'split-pdf',
  'remove-pages-from-pdf',
  'extract-pages-from-pdf',
  'scan-to-pdf',
  'rotate-pdf',
  'add-page-numbers-to-pdf',
  'add-watermark-to-pdf',
  'add-header-footer-to-pdf',
  'remove-pdf-metadata',
  'scan-cleaner',
  'grayscale-pdf',
  'flatten-pdf',
  'convert-to-pdf',
  'sign-pdf',
  'pdf-to-text',
];


export const LIMITED_TOOL_IDS = [
  'optimize-pdf',
  'compress-pdf',
  'repair-pdf',
  'ocr-pdf',
  'html-to-pdf',
  'convert-from-pdf',
  'pdf-to-word',
  'pdf-to-powerpoint',
  'pdf-to-excel',
  'pdf-to-pdfa',
  'edit-pdf',
  'crop-pdf',
  'pdf-forms',
  'pdf-security',
  'unlock-pdf',
  'protect-pdf',
  'compare-pdf',
  'extract-images-from-pdf',
  'deskew-pdf',
  'resize-pdf-pages',
  'extract-tables-from-pdf',
];

export const ADAPTER_TOOL_IDS = [
  'background-remover',
  'image-enhancer',
  'word-to-pdf',
  'excel-to-pdf',
  'powerpoint-to-pdf',
  'pdf-to-image',
  'redact-pdf'
];

const toolStatus = (id) => {
  if (READY_TOOL_IDS.includes(id)) return 'ready';
  if (ADAPTER_TOOL_IDS.includes(id)) return 'adapter';
  if (LIMITED_TOOL_IDS.includes(id)) return 'limited';
  return 'coming-soon';
};

export const categories = [
  { id: 'text-tools', name: 'Text Tools', description: 'Text utilities that are ready for basic browser-based use.', icon: 'Type', color: '#2563eb' },
  { id: 'business-tools', name: 'Business Tools', description: 'Business document tools planned for future releases.', icon: 'Briefcase', color: '#7c3aed' },
  { id: 'calculator-tools', name: 'Calculator Tools', description: 'Everyday calculators planned for future releases.', icon: 'Calculator', color: '#059669' },
  { id: 'developer-tools', name: 'Developer Tools', description: 'Developer utilities planned for future releases.', icon: 'Code', color: '#ea580c' },
  { id: 'qr-tools', name: 'QR & Barcode Tools', description: 'QR and barcode utilities for links, text, products, and contacts.', icon: 'QrCode', color: '#0891b2' },
  { id: 'image-tools', name: 'Image & File Tools', description: 'Daily browser-based image tools plus API-backed adapters for advanced image processing.', icon: 'Image', color: '#0d9488' },
  { id: 'pdf-tools', name: 'PDF Tools', description: 'Privacy-first PDF utilities for merging, splitting, organizing, converting, cleaning, annotating, and securing documents.', icon: 'FileText', color: '#dc2626' },
  { id: 'social-tools', name: 'Social Media Tools', description: 'Creator workflow tools planned for future releases.', icon: 'Share2', color: '#db2777' }
];

const rawTools = [
  { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences, paragraphs, and lines in your text.', category: 'text-tools', icon: 'FileText', popular: true },
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters with and without spaces, plus letters, digits, symbols, and spaces.', category: 'text-tools', icon: 'Hash', popular: true },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text between uppercase, lowercase, title case, sentence case, and URL-safe cases.', category: 'text-tools', icon: 'Type', popular: true },
  { id: 'remove-extra-spaces', name: 'Remove Extra Spaces', description: 'Clean up text by reducing extra whitespace.', category: 'text-tools', icon: 'Eraser', popular: false },
  { id: 'text-to-slug', name: 'Text to Slug', description: 'Convert text to URL-friendly slugs for readable links.', category: 'text-tools', icon: 'Link', popular: true },
  { id: 'duplicate-line-remover', name: 'Duplicate Line Remover', description: 'Remove duplicate lines while preserving order or sorting alphabetically.', category: 'text-tools', icon: 'ListFilter', popular: false },
  { id: 'text-sorter', name: 'Text Sorter', description: 'Sort non-empty lines alphabetically, by length, or reverse their order.', category: 'text-tools', icon: 'ArrowUpDown', popular: false },
  { id: 'find-and-replace', name: 'Find and Replace Text', description: 'Find and replace plain text with optional case sensitivity.', category: 'text-tools', icon: 'Search', popular: false },

  { id: 'invoice-generator', name: 'Invoice Generator', description: 'Build itemized invoices in your browser and export them as PDF.', category: 'business-tools', icon: 'FileText', popular: true },
  { id: 'receipt-generator', name: 'Receipt Generator', description: 'Planned receipt generator UI.', category: 'business-tools', icon: 'Receipt', popular: true },
  { id: 'quotation-generator', name: 'Quotation Generator', description: 'Planned quotation builder UI.', category: 'business-tools', icon: 'FileText', popular: false },
  { id: 'salary-slip-generator', name: 'Salary Slip Generator', description: 'Planned salary slip generator UI.', category: 'business-tools', icon: 'DollarSign', popular: false },
  { id: 'purchase-order-generator', name: 'Purchase Order Generator', description: 'Planned purchase order UI.', category: 'business-tools', icon: 'ShoppingCart', popular: false },
  { id: 'delivery-note-generator', name: 'Delivery Note Generator', description: 'Planned delivery note UI.', category: 'business-tools', icon: 'Truck', popular: false },
  { id: 'proforma-invoice-generator', name: 'Proforma Invoice Generator', description: 'Planned proforma invoice UI.', category: 'business-tools', icon: 'FileSpreadsheet', popular: false },

  { id: 'emi-calculator', name: 'EMI Calculator', description: 'Calculate monthly loan EMI from principal, interest rate, and tenure.', category: 'calculator-tools', icon: 'CreditCard', popular: true },
  { id: 'gst-calculator', name: 'GST Calculator', description: 'Add or remove GST and see net, tax, and gross amounts.', category: 'calculator-tools', icon: 'Percent', popular: true },
  { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index from height and weight.', category: 'calculator-tools', icon: 'Heart', popular: true },
  { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age in years, months, and days from a date of birth.', category: 'calculator-tools', icon: 'Calendar', popular: false },
  { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Work out percentages, increases, and decreases between values.', category: 'calculator-tools', icon: 'Percent', popular: false },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between common length, weight, and temperature units.', category: 'calculator-tools', icon: 'Scale', popular: false },
  { id: 'date-calculator', name: 'Date Calculator', description: 'Find the difference between two dates or add/subtract days.', category: 'calculator-tools', icon: 'CalendarDays', popular: false },

  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, indent, and validate JSON in your browser.', category: 'developer-tools', icon: 'Braces', popular: true },
  { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', description: 'Encode text to Base64 or decode Base64 back to text.', category: 'developer-tools', icon: 'Code', popular: true },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Percent-encode or decode URL components.', category: 'developer-tools', icon: 'Globe', popular: false },
  { id: 'html-encoder', name: 'HTML Encoder/Decoder', description: 'Convert text to and from HTML entities.', category: 'developer-tools', icon: 'FileCode', popular: false },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS by removing whitespace and comments.', category: 'developer-tools', icon: 'Palette', popular: false },
  { id: 'js-minifier', name: 'JS Minifier', description: 'Minify JavaScript by stripping whitespace and comments.', category: 'developer-tools', icon: 'Terminal', popular: false },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate strong random passwords with selectable options.', category: 'developer-tools', icon: 'Lock', popular: true },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder paragraphs, sentences, or words.', category: 'developer-tools', icon: 'Type', popular: false },

  { id: 'qr-code-generator', name: 'QR Code Generator', description: 'Generate a QR code from text or a URL and download it as PNG.', category: 'qr-tools', icon: 'QrCode', popular: true },
  { id: 'wifi-qr-generator', name: 'WiFi QR Generator', description: 'Generate a QR code that connects devices to your WiFi network.', category: 'qr-tools', icon: 'Wifi', popular: false },
  { id: 'whatsapp-qr-generator', name: 'WhatsApp QR Generator', description: 'Generate a QR code that opens a WhatsApp chat with a preset message.', category: 'qr-tools', icon: 'MessageCircle', popular: false },
  { id: 'barcode-generator', name: 'Barcode Generator', description: 'Generate common barcodes from text or numbers and download them.', category: 'qr-tools', icon: 'Barcode', popular: true },
  { id: 'vcard-qr-generator', name: 'vCard QR Generator', description: 'Generate a QR code that shares contact details as a vCard.', category: 'qr-tools', icon: 'Contact', popular: false },

  { id: 'image-resize', name: 'Image Resize', description: 'Resize JPG, PNG, or WEBP images in your browser with optional aspect-ratio lock.', category: 'image-tools', icon: 'Image', popular: true },
  { id: 'image-compress', name: 'Image Compress', description: 'Compress JPG, PNG, or WEBP images client-side and download the created output.', category: 'image-tools', icon: 'Image', popular: true },
  { id: 'image-converter', name: 'Image Converter', description: 'Convert JPG, PNG, and WEBP images in your browser.', category: 'image-tools', icon: 'Image', popular: true },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Combine one or more images into a downloadable PDF in your browser.', category: 'image-tools', icon: 'FileText', popular: true },
  { id: 'cnic-id-card-duplex-print', name: 'CNIC / ID Card Duplex Print', description: 'Create aligned front/back A4 duplex PDF layouts for CNIC, ID cards, licenses and similar cards.', category: 'image-tools', icon: 'FileText', popular: true },
  { id: 'background-remover', name: 'Background Remover', description: 'Upload an image and call a configured background remover API. No local fake removal is performed.', category: 'image-tools', icon: 'Image', popular: false },
  { id: 'image-enhancer', name: 'Image Enhancer', description: 'Upload an image and call a configured image enhancer API. No fake enhancement is performed.', category: 'image-tools', icon: 'Sparkles', popular: false },

  { id: 'organize-pdf', name: 'Organize PDF', description: 'Reorder, rotate, remove, or extract PDF pages in your browser.', category: 'pdf-tools', icon: 'Layers', popular: true },
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one downloadable PDF.', category: 'pdf-tools', icon: 'Files', popular: true },
  { id: 'split-pdf', name: 'Split PDF', description: 'Split or extract selected PDF page ranges.', category: 'pdf-tools', icon: 'Scissors', popular: true },
  { id: 'remove-pages-from-pdf', name: 'Remove Pages from PDF', description: 'Remove selected pages and download a cleaned PDF.', category: 'pdf-tools', icon: 'Trash2', popular: false },
  { id: 'extract-pages-from-pdf', name: 'Extract Pages from PDF', description: 'Export selected pages into a new PDF.', category: 'pdf-tools', icon: 'Copy', popular: false },
  { id: 'scan-to-pdf', name: 'Scan to PDF', description: 'Convert images or scan photos into high-quality printable PDF.', category: 'pdf-tools', icon: 'ScanLine', popular: true },
  { id: 'optimize-pdf', name: 'Optimize PDF', description: 'Best-effort client-side PDF re-save and metadata cleanup.', category: 'pdf-tools', icon: 'Gauge', popular: false },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Compress scanned/image PDFs through raster optimization.', category: 'pdf-tools', icon: 'Archive', popular: true },
  { id: 'repair-pdf', name: 'Repair PDF', description: 'Best-effort client-side repair by loading and re-saving readable PDFs.', category: 'pdf-tools', icon: 'Wrench', popular: false },
  { id: 'ocr-pdf', name: 'OCR PDF', description: 'OCR adapter page. Requires an OCR library before text recognition is available.', category: 'pdf-tools', icon: 'ScanText', popular: false },
  { id: 'convert-to-pdf', name: 'Convert to PDF', description: 'Convert images or text into PDF; Office conversion is limited without backend.', category: 'pdf-tools', icon: 'FilePlus', popular: true },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'DOC/DOCX to PDF adapter route. Requires backend Office conversion setup for real conversion.', category: 'pdf-tools', icon: 'FileText', popular: true },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'XLS/XLSX to PDF adapter route. Requires backend Office conversion setup for real conversion.', category: 'pdf-tools', icon: 'Table', popular: true },
  { id: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', description: 'PPT/PPTX to PDF adapter route. Requires backend Office conversion setup for real conversion.', category: 'pdf-tools', icon: 'Presentation', popular: true },
  { id: 'pdf-to-image', name: 'PDF to Image', description: 'Render PDF pages to images. Requires a configured rendering adapter; no fake conversion is shown.', category: 'pdf-tools', icon: 'Images', popular: false },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Client-side HTML/text PDF conversion with URL capture limitations.', category: 'pdf-tools', icon: 'Code', popular: false },
  { id: 'convert-from-pdf', name: 'Convert from PDF', description: 'Convert PDF to text or rendered page images where supported.', category: 'pdf-tools', icon: 'FileOutput', popular: false },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Extract selectable PDF text for DOC-compatible export. Layout conversion is limited.', category: 'pdf-tools', icon: 'FileText', popular: false },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', description: 'Limited PDF-to-slide adapter; PPTX export library is not installed.', category: 'pdf-tools', icon: 'Presentation', popular: false },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract selectable table-like text as CSV.', category: 'pdf-tools', icon: 'Table', popular: false },
  { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', description: 'Best-effort PDF/A metadata setup. Certified validation is limited.', category: 'pdf-tools', icon: 'BadgeCheck', popular: false },
  { id: 'edit-pdf', name: 'Edit PDF', description: 'Add new text annotations to a PDF. Existing text editing is limited.', category: 'pdf-tools', icon: 'Edit3', popular: false },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate all or selected PDF pages.', category: 'pdf-tools', icon: 'RotateCw', popular: false },
  { id: 'add-page-numbers-to-pdf', name: 'Add Page Numbers', description: 'Add page numbers to PDF pages.', category: 'pdf-tools', icon: 'ListOrdered', popular: false },
  { id: 'add-watermark-to-pdf', name: 'Add Watermark', description: 'Apply text watermarks to PDF pages.', category: 'pdf-tools', icon: 'Droplets', popular: false },
  { id: 'crop-pdf', name: 'Crop PDF', description: 'Limited numeric crop workflow for PDF pages.', category: 'pdf-tools', icon: 'Crop', popular: false },
  { id: 'pdf-forms', name: 'PDF Forms', description: 'Limited support for AcroForm fields; complex XFA forms may be unsupported.', category: 'pdf-tools', icon: 'FormInput', popular: false },
  { id: 'pdf-security', name: 'PDF Security Hub', description: 'Links and honest limitations for PDF security tools.', category: 'pdf-tools', icon: 'Shield', popular: false },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Open password-protected PDFs when the user provides the correct password. No cracking.', category: 'pdf-tools', icon: 'Unlock', popular: false },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Password protection adapter; encryption support is limited client-side.', category: 'pdf-tools', icon: 'Lock', popular: false },
  { id: 'sign-pdf', name: 'Sign PDF', description: 'Add visual/e-sign style signature text to a PDF.', category: 'pdf-tools', icon: 'PenTool', popular: false },
  { id: 'redact-pdf', name: 'Redact PDF', description: 'Safe PDF redaction requires backend processing. No fake redaction is performed client-side.', category: 'pdf-tools', icon: 'Eraser', popular: false },
  { id: 'compare-pdf', name: 'Compare PDF', description: 'Compare PDFs with basic page/render checks. Advanced diff is limited.', category: 'pdf-tools', icon: 'GitCompare', popular: false },
  { id: 'remove-pdf-metadata', name: 'Remove PDF Metadata', description: 'Clear standard PDF metadata fields where supported.', category: 'pdf-tools', icon: 'ShieldX', popular: false },
  { id: 'extract-images-from-pdf', name: 'Extract Images from PDF', description: 'Extract rendered page images and package them for download.', category: 'pdf-tools', icon: 'Images', popular: false },
  { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract selectable text from PDF pages.', category: 'pdf-tools', icon: 'Text', popular: true },
  { id: 'scan-cleaner', name: 'Scan Cleaner', description: 'Clean blackish scans and produce print-friendly PDFs.', category: 'pdf-tools', icon: 'Sparkles', popular: true },
  { id: 'deskew-pdf', name: 'Deskew PDF', description: 'Manual deskew/raster correction workflow with limited auto deskew.', category: 'pdf-tools', icon: 'SlidersHorizontal', popular: false },
  { id: 'grayscale-pdf', name: 'Grayscale PDF', description: 'Convert PDF pages to grayscale visual PDF.', category: 'pdf-tools', icon: 'Palette', popular: false },
  { id: 'flatten-pdf', name: 'Flatten PDF', description: 'Render PDF pages and rebuild a fixed visual PDF.', category: 'pdf-tools', icon: 'Layers', popular: false },
  { id: 'add-header-footer-to-pdf', name: 'Add Header/Footer', description: 'Add header and footer text to PDF pages.', category: 'pdf-tools', icon: 'PanelTop', popular: false },
  { id: 'resize-pdf-pages', name: 'Resize PDF Pages', description: 'Fit PDF pages onto standard page sizes while preserving aspect ratio.', category: 'pdf-tools', icon: 'Maximize', popular: false },
  { id: 'extract-tables-from-pdf', name: 'Extract Tables from PDF', description: 'Extract selectable table-like text to CSV with honest limitations.', category: 'pdf-tools', icon: 'TableProperties', popular: false },

  { id: 'caption-generator', name: 'Caption Generator', description: 'Planned caption helper UI.', category: 'social-tools', icon: 'MessageSquare', popular: true },
  { id: 'hashtag-generator', name: 'Hashtag Generator', description: 'Planned hashtag helper UI.', category: 'social-tools', icon: 'Hash', popular: true },
  { id: 'youtube-thumbnail-downloader', name: 'YouTube Thumbnail Downloader', description: 'Planned thumbnail utility UI.', category: 'social-tools', icon: 'Youtube', popular: false },
  { id: 'social-post-scheduler', name: 'Social Post Scheduler', description: 'Planned social planning UI.', category: 'social-tools', icon: 'Clock', popular: false }
];

export const tools = rawTools.map(tool => ({ ...tool, status: toolStatus(tool.id) }));

export const getCategoryById = (id) => categories.find(c => c.id === id);
export const getToolsByCategory = (categoryId) => tools.filter(t => t.category === categoryId);
export const getToolById = (id) => tools.find(t => t.id === id);
export const getPopularTools = () => tools.filter(t => t.popular);
export const getReadyTools = () => tools.filter(t => t.status === 'ready');
export const getComingSoonTools = () => tools.filter(t => t.status === 'coming-soon');
export const getAdapterTools = () => tools.filter(t => t.status === 'adapter');
export const getLimitedTools = () => tools.filter(t => t.status === 'limited');
export const searchTools = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    tool.category.toLowerCase().includes(q)
  );
};


