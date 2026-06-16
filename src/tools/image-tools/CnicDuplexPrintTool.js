import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Printer, ShieldCheck } from 'lucide-react';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';

const PAPER_SIZES = {
  a4: { label: 'A4', width: 210, height: 297 }
};

const COPY_LAYOUTS = {
  1: { cols: 1, rows: 1 },
  2: { cols: 1, rows: 2 },
  4: { cols: 2, rows: 2 },
  6: { cols: 2, rows: 3 },
  8: { cols: 2, rows: 4 }
};

const allowedCopies = [1, 2, 4, 6, 8];
const privacyCopy = 'Your ID images stay in your browser. Nothing is uploaded.';
const printCopy = 'Print at Actual Size / 100%. Enable duplex printing with Long-edge flip. Do a test print before final use.';

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Image file read nahi ho saki.'));
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(file);
});

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onerror = () => reject(new Error('Image preview/load fail ho gaya.'));
  image.onload = () => resolve(image);
  image.src = src;
});

const imageToPdfDataUrl = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
};

function getEffectiveCardSize({ width, height, orientation }) {
  const w = Number(width);
  const h = Number(height);
  if (orientation === 'portrait') return { width: Math.min(w, h), height: Math.max(w, h) };
  return { width: Math.max(w, h), height: Math.min(w, h) };
}

function calculatePositions({ paper, card, copies, gapX, gapY, offsetX = 0, offsetY = 0 }) {
  const layout = COPY_LAYOUTS[copies];
  const totalGridWidth = layout.cols * card.width + (layout.cols - 1) * gapX;
  const totalGridHeight = layout.rows * card.height + (layout.rows - 1) * gapY;
  const startX = (paper.width - totalGridWidth) / 2 + offsetX;
  const startY = (paper.height - totalGridHeight) / 2 + offsetY;
  const positions = [];
  for (let row = 0; row < layout.rows; row += 1) {
    for (let col = 0; col < layout.cols; col += 1) {
      if (positions.length >= copies) break;
      positions.push({
        x: startX + col * (card.width + gapX),
        y: startY + row * (card.height + gapY),
        width: card.width,
        height: card.height
      });
    }
  }
  return { positions, totalGridWidth, totalGridHeight, startX, startY };
}

function getImageDrawRect(slot, image, fitMode) {
  const imageRatio = image.width / image.height;
  const slotRatio = slot.width / slot.height;
  let drawWidth = slot.width;
  let drawHeight = slot.height;
  if (fitMode === 'contain') {
    if (imageRatio > slotRatio) drawHeight = slot.width / imageRatio;
    else drawWidth = slot.height * imageRatio;
  } else if (imageRatio > slotRatio) {
    drawWidth = slot.height * imageRatio;
  } else {
    drawHeight = slot.width / imageRatio;
  }
  return {
    x: slot.x + (slot.width - drawWidth) / 2,
    y: slot.y + (slot.height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight
  };
}

function drawCutMarks(doc, slot) {
  const mark = 4;
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.15);
  doc.line(slot.x, slot.y, slot.x + mark, slot.y);
  doc.line(slot.x, slot.y, slot.x, slot.y + mark);
  doc.line(slot.x + slot.width, slot.y, slot.x + slot.width - mark, slot.y);
  doc.line(slot.x + slot.width, slot.y, slot.x + slot.width, slot.y + mark);
  doc.line(slot.x, slot.y + slot.height, slot.x + mark, slot.y + slot.height);
  doc.line(slot.x, slot.y + slot.height, slot.x, slot.y + slot.height - mark);
  doc.line(slot.x + slot.width, slot.y + slot.height, slot.x + slot.width - mark, slot.y + slot.height);
  doc.line(slot.x + slot.width, slot.y + slot.height, slot.x + slot.width, slot.y + slot.height - mark);
}

function PreviewPage({ title, imageUrl, positions, paper, fitMode, card, emptyText }) {
  const scale = 1.35;
  return (
    <div className="cnic-preview-page-card">
      <h3>{title}</h3>
      <div className="cnic-a4-preview" style={{ aspectRatio: `${paper.width} / ${paper.height}` }}>
        {imageUrl ? positions.map((slot, index) => {
          const left = (slot.x / paper.width) * 100;
          const top = (slot.y / paper.height) * 100;
          const width = (slot.width / paper.width) * 100;
          const height = (slot.height / paper.height) * 100;
          return (
            <div key={`${title}-${index}`} className="cnic-preview-slot" style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}>
              <img src={imageUrl} alt="ID card preview" className={`cnic-preview-image fit-${fitMode}`} />
              <span>{index + 1}</span>
            </div>
          );
        }) : <p>{emptyText}</p>}
      </div>
      <small>{positions.length} copies • card {card.width.toFixed(1)}mm × {card.height.toFixed(1)}mm • preview scale approx {scale}x screen-only</small>
    </div>
  );
}

function CnicDuplexPrintTool() {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontUrl, setFrontUrl] = useState('');
  const [backUrl, setBackUrl] = useState('');
  const [paperSize, setPaperSize] = useState('a4');
  const [cardWidth, setCardWidth] = useState(85.6);
  const [cardHeight, setCardHeight] = useState(54);
  const [orientation, setOrientation] = useState('landscape');
  const [copies, setCopies] = useState(8);
  const [gapX, setGapX] = useState(6);
  const [gapY, setGapY] = useState(6);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [mirrorBack, setMirrorBack] = useState(false);
  const [backOffsetX, setBackOffsetX] = useState(0);
  const [backOffsetY, setBackOffsetY] = useState(0);
  const [cutMarks, setCutMarks] = useState(true);
  const [fitMode, setFitMode] = useState('cover');
  const [error, setError] = useState('');
  const [output, setOutput] = useState(null);

  const paper = PAPER_SIZES[paperSize];
  const card = useMemo(() => getEffectiveCardSize({ width: cardWidth, height: cardHeight, orientation }), [cardWidth, cardHeight, orientation]);
  const layout = useMemo(() => calculatePositions({ paper, card, copies, gapX: Number(gapX), gapY: Number(gapY), offsetX: Number(offsetX), offsetY: Number(offsetY) }), [paper, card, copies, gapX, gapY, offsetX, offsetY]);
  const backPositions = useMemo(() => layout.positions.map((slot) => ({
    ...slot,
    x: (mirrorBack ? paper.width - slot.x - slot.width : slot.x) + Number(backOffsetX),
    y: slot.y + Number(backOffsetY)
  })), [layout.positions, mirrorBack, paper.width, backOffsetX, backOffsetY]);

  const handleImage = async (file, side) => {
    setError('');
    setOutput(null);
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('JPG, PNG, ya WEBP image upload karein.'); return; }
    const url = await fileToDataUrl(file);
    if (side === 'front') { setFrontFile(file); setFrontUrl(url); }
    else { setBackFile(file); setBackUrl(url); }
  };

  const validateLayout = () => {
    if (!frontFile || !frontUrl) return 'Front image required hai.';
    if (!backFile || !backUrl) return 'Back image required hai duplex PDF ke liye.';
    if (!allowedCopies.includes(Number(copies))) return 'Copies sirf 1, 2, 4, 6, ya 8 allowed hain.';
    if (card.width <= 0 || card.height <= 0) return 'Card width/height positive mm honi chahiye.';
    if (Number(gapX) < 0 || Number(gapY) < 0) return 'Spacing negative nahi ho sakti.';
    if (layout.totalGridWidth > paper.width || layout.totalGridHeight > paper.height) return 'Card grid A4 paper area mein fit nahi ho rahi. Copies, card size, ya spacing reduce karein.';
    if (layout.startX < 0 || layout.startY < 0) return 'Margins/offset grid ko paper se bahar le ja rahe hain.';
    if (backPositions.some((slot) => slot.x < 0 || slot.y < 0 || slot.x + slot.width > paper.width || slot.y + slot.height > paper.height)) return 'Back side offset/mirror layout ko A4 se bahar le ja raha hai.';
    return '';
  };

  const generatePdf = async () => {
    setError('');
    setOutput(null);
    const validation = validateLayout();
    if (validation) { setError(validation); return; }
    try {
      const [frontImage, backImage] = await Promise.all([loadImage(frontUrl), loadImage(backUrl)]);
      const frontPdfImage = imageToPdfDataUrl(frontImage);
      const backPdfImage = imageToPdfDataUrl(backImage);
      const doc = new jsPDF({ unit: 'mm', format: [paper.width, paper.height], orientation: 'portrait' });
      const addLayoutPage = (imageUrl, image, positions) => {
        positions.forEach((slot) => {
          const draw = getImageDrawRect(slot, image, fitMode);
          doc.addImage(imageUrl, 'JPEG', draw.x, draw.y, draw.width, draw.height);
          if (cutMarks) drawCutMarks(doc, slot);
        });
      };
      addLayoutPage(frontPdfImage, frontImage, layout.positions);
      doc.addPage([paper.width, paper.height], 'portrait');
      addLayoutPage(backPdfImage, backImage, backPositions);
      const blob = doc.output('blob');
      if (!blob || !blob.size) throw new Error('PDF output empty generate hua.');
      if (output?.url) URL.revokeObjectURL(output.url);
      setOutput({ url: URL.createObjectURL(blob), name: 'cnic-id-card-duplex-print.pdf', size: blob.size });
    } catch (err) {
      setError(err.message || 'PDF generate nahi ho saka.');
    }
  };

  return (
    <div className="tool-card cnic-duplex-tool">
      <div className="cnic-tool-header">
        <div>
          <span className="status-ready">Working client-side</span>
          <h2>CNIC / ID Card Duplex Print Layout</h2>
          <p>{privacyCopy}</p>
        </div>
        <ShieldCheck size={42} />
      </div>

      <div className="cnic-duplex-grid">
        <label className="cnic-upload-card">
          <strong>Front image upload</strong>
          <span>CNIC / ID front side</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleImage(event.target.files?.[0], 'front')} />
          {frontUrl && <img src={frontUrl} alt="Front ID preview" />}
        </label>
        <label className="cnic-upload-card">
          <strong>Back image upload</strong>
          <span>CNIC / ID back side</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleImage(event.target.files?.[0], 'back')} />
          {backUrl && <img src={backUrl} alt="Back ID preview" />}
        </label>
      </div>

      <div className="cnic-settings-panel">
        <div><label>Paper size</label><select className="form-select" value={paperSize} onChange={(e) => setPaperSize(e.target.value)}><option value="a4">A4 — 210mm × 297mm</option></select></div>
        <div><label>Card width mm</label><input className="form-input" type="number" step="0.1" value={cardWidth} onChange={(e) => setCardWidth(Number(e.target.value))} /></div>
        <div><label>Card height mm</label><input className="form-input" type="number" step="0.1" value={cardHeight} onChange={(e) => setCardHeight(Number(e.target.value))} /></div>
        <div><label>Copies per A4 page</label><select className="form-select" value={copies} onChange={(e) => setCopies(Number(e.target.value))}>{allowedCopies.map((count) => <option key={count} value={count}>{count}</option>)}</select></div>
        <div><label>Card orientation</label><select className="form-select" value={orientation} onChange={(e) => setOrientation(e.target.value)}><option value="landscape">Landscape</option><option value="portrait">Portrait</option></select></div>
        <div><label>Fit mode</label><select className="form-select" value={fitMode} onChange={(e) => setFitMode(e.target.value)}><option value="cover">Cover card area</option><option value="contain">Contain inside card</option></select></div>
        <div><label>Gap X mm</label><input className="form-input" type="number" step="0.5" value={gapX} onChange={(e) => setGapX(Number(e.target.value))} /></div>
        <div><label>Gap Y mm</label><input className="form-input" type="number" step="0.5" value={gapY} onChange={(e) => setGapY(Number(e.target.value))} /></div>
        <div><label>Layout offset X mm</label><input className="form-input" type="number" step="0.5" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} /></div>
        <div><label>Layout offset Y mm</label><input className="form-input" type="number" step="0.5" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} /></div>
        <div><label>Back offset X mm</label><input className="form-input" type="number" step="0.5" value={backOffsetX} onChange={(e) => setBackOffsetX(Number(e.target.value))} /></div>
        <div><label>Back offset Y mm</label><input className="form-input" type="number" step="0.5" value={backOffsetY} onChange={(e) => setBackOffsetY(Number(e.target.value))} /></div>
      </div>

      <div className="cnic-toggle-row">
        <label><input type="checkbox" checked={cutMarks} onChange={(e) => setCutMarks(e.target.checked)} /> Cut/crop marks</label>
        <label><input type="checkbox" checked={mirrorBack} onChange={(e) => setMirrorBack(e.target.checked)} /> Back side mirror alignment</label>
        <small>Use this only if your printer flips backside alignment during duplex printing.</small>
      </div>

      <div className="cnic-instruction-panel">
        <Printer size={22} />
        <div><strong>Print instructions</strong><p>{printCopy}</p></div>
      </div>

      <ErrorMessage message={error} />

      <div className="cnic-preview-grid">
        <PreviewPage title={`Preview Page 1: Front x ${copies}`} imageUrl={frontUrl} positions={layout.positions} paper={paper} card={card} fitMode={fitMode} emptyText="Front image preview yahan show hogi." />
        <PreviewPage title={`Preview Page 2: Back x ${copies}`} imageUrl={backUrl} positions={backPositions} paper={paper} card={card} fitMode={fitMode} emptyText="Back image preview yahan show hogi." />
      </div>

      <div className="tool-button-row">
        <button type="button" className="btn btn-primary" onClick={generatePdf}><FileText size={16} /> Generate duplex PDF</button>
        <DownloadButton href={output?.url} filename={output?.name} disabled={!output}>Download duplex PDF</DownloadButton>
      </div>
      {output && <div className="info-note">PDF ready: <strong>{(output.size / 1024).toFixed(1)} KB</strong></div>}
    </div>
  );
}

export default CnicDuplexPrintTool;
