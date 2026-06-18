import React, { useEffect, useMemo, useRef, useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { blobToDownload, canvasToBlob, formatBytes, loadImageFromFile, validateImageFile } from './imageUtils';

const toolInfo = {
  'image-crop': {
    title: 'Image Crop',
    action: 'Crop image',
    description: 'Crop a centered area of JPG, PNG, or WEBP images by choosing how much to keep.',
    outputName: 'cropped-image.png'
  },
  'image-rotate-flip': {
    title: 'Image Rotate / Flip',
    action: 'Rotate / flip image',
    description: 'Rotate 90° and optionally flip an image client-side.',
    outputName: 'rotated-flipped-image.png'
  },
  'image-watermark': {
    title: 'Image Watermark',
    action: 'Add watermark',
    description: 'Add a text watermark to the bottom-right of an image.',
    outputName: 'watermarked-image.png'
  },
  'image-blur-pixelate': {
    title: 'Image Blur / Pixelate',
    action: 'Blur / pixelate image',
    description: 'Apply blur or pixelation to an image in your browser.',
    outputName: 'blurred-pixelated-image.png'
  },
  'color-picker': {
    title: 'Color Picker',
    action: 'Pick color',
    description: 'Upload an image and click anywhere on it to read that pixel color as HEX/RGB.',
    outputName: ''
  }
};

const defaultInfo = toolInfo['image-crop'];

const makeOutput = async (canvas, filename) => {
  const blob = await canvasToBlob(canvas, 'image/png', 0.92);
  if (!blob || !blob.size) throw new Error('Generated image was empty.');
  return { ...blobToDownload(blob), filename };
};

function ImageTransformTool({ toolId }) {
  const info = toolInfo[toolId] || defaultInfo;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [watermarkText, setWatermarkText] = useState('ToolKitGo');
  const [effectMode, setEffectMode] = useState('blur');
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [cropPercent, setCropPercent] = useState(80);
  const [colorResult, setColorResult] = useState(null);
  const pickCanvasRef = useRef(null);

  const isColorPicker = toolId === 'color-picker';
  const isWatermark = toolId === 'image-watermark';
  const isBlurPixelate = toolId === 'image-blur-pixelate';
  const isRotateFlip = toolId === 'image-rotate-flip';
  const isCrop = toolId === 'image-crop';

  const outputLabel = useMemo(() => output ? `${output.filename} (${formatBytes(output.size)})` : '', [output]);

  const resetOutput = () => {
    if (output?.url) URL.revokeObjectURL(output.url);
    setOutput(null);
    setColorResult(null);
  };

  const handleFile = async (selected) => {
    resetOutput();
    setError('');
    const validation = validateImageFile(selected);
    if (validation) { setError(validation); return; }
    setFile(selected);
    const { dataUrl } = await loadImageFromFile(selected);
    setPreview(dataUrl);
  };

  // Color picker: draw the uploaded image onto a clickable canvas (scaled to fit).
  useEffect(() => {
    if (!isColorPicker || !file) return undefined;
    let cancelled = false;
    loadImageFromFile(file).then(({ image }) => {
      if (cancelled) return;
      const canvas = pickCanvasRef.current;
      if (!canvas) return;
      const maxW = 360;
      const scale = Math.min(1, maxW / image.naturalWidth);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [file, isColorPicker]);

  const pickAt = (event) => {
    const canvas = pickCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.round((event.clientY - rect.top) * (canvas.height / rect.height));
    const cx = Math.max(0, Math.min(canvas.width - 1, x));
    const cy = Math.max(0, Math.min(canvas.height - 1, y));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const p = ctx.getImageData(cx, cy, 1, 1).data;
    const hex = `#${[p[0], p[1], p[2]].map(v => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
    setColorResult({ hex, rgb: `rgb(${p[0]}, ${p[1]}, ${p[2]})` });
  };

  const run = async () => {
    setError('');
    resetOutput();
    if (!file) { setError('Choose an image first.'); return; }
    try {
      setLoading(true);
      const { image } = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      let ctx;

      if (isCrop) {
        const pct = Math.min(100, Math.max(10, Number(cropPercent) || 80)) / 100;
        const cw = Math.max(1, Math.round(image.naturalWidth * pct));
        const ch = Math.max(1, Math.round(image.naturalHeight * pct));
        const sx = Math.floor((image.naturalWidth - cw) / 2);
        const sy = Math.floor((image.naturalHeight - ch) / 2);
        canvas.width = cw;
        canvas.height = ch;
        ctx = canvas.getContext('2d');
        ctx.drawImage(image, sx, sy, cw, ch, 0, 0, cw, ch);
        setOutput(await makeOutput(canvas, info.outputName));
        return;
      }

      if (isRotateFlip) {
        canvas.width = image.naturalHeight;
        canvas.height = image.naturalWidth;
        ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
        ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
        setOutput(await makeOutput(canvas, info.outputName));
        return;
      }

      if (isWatermark) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const fontSize = Math.max(18, Math.round(canvas.width * 0.045));
        ctx.font = `700 ${fontSize}px Arial, sans-serif`;
        ctx.textBaseline = 'bottom';
        const pad = Math.max(18, Math.round(canvas.width * 0.025));
        const text = watermarkText.trim() || 'ToolKitGo';
        const metrics = ctx.measureText(text);
        const x = canvas.width - metrics.width - pad;
        const y = canvas.height - pad;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(x - pad / 2, y - fontSize - pad / 2, metrics.width + pad, fontSize + pad);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.fillText(text, x, y);
        setOutput(await makeOutput(canvas, info.outputName));
        return;
      }

      if (isBlurPixelate) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx = canvas.getContext('2d');
        if (effectMode === 'pixelate') {
          const small = document.createElement('canvas');
          const scale = 0.08;
          small.width = Math.max(1, Math.round(canvas.width * scale));
          small.height = Math.max(1, Math.round(canvas.height * scale));
          const smallCtx = small.getContext('2d');
          smallCtx.drawImage(image, 0, 0, small.width, small.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.filter = 'blur(8px)';
          ctx.drawImage(image, 0, 0);
          ctx.filter = 'none';
        }
        setOutput(await makeOutput(canvas, info.outputName));
        return;
      }
    } catch (err) {
      setError(err.message || 'Image processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card tool-card-wide">
      <div className="tool-header"><h2>{info.title}</h2><span className="status-ready">Working client-side</span></div>
      <p className="tool-description">{info.description} Files stay in your browser.</p>
      <FileUploader accept="image/png,image/jpeg,image/webp" label="Upload JPG, PNG, or WEBP" onChange={handleFile} />

      {isCrop && <label className="form-label">Crop area kept (% of image)<input className="form-input" type="number" min="10" max="100" value={cropPercent} onChange={(e) => setCropPercent(e.target.value)} /></label>}
      {isRotateFlip && <div className="option-grid"><label><input type="checkbox" checked={flipHorizontal} onChange={(e) => setFlipHorizontal(e.target.checked)} /> Flip horizontal</label><label><input type="checkbox" checked={flipVertical} onChange={(e) => setFlipVertical(e.target.checked)} /> Flip vertical</label></div>}
      {isWatermark && <label className="form-label">Watermark text<input className="form-input" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} /></label>}
      {isBlurPixelate && <label className="form-label">Effect<select className="form-input" value={effectMode} onChange={(e) => setEffectMode(e.target.value)}><option value="blur">Blur</option><option value="pixelate">Pixelate</option></select></label>}

      {isColorPicker ? (
        <>
          {preview ? (
            <div className="color-pick-area">
              <p className="tool-description">Click anywhere on the image to pick a color.</p>
              <canvas ref={pickCanvasRef} className="pick-canvas" onClick={pickAt} />
            </div>
          ) : <p className="tool-description">No image selected yet.</p>}
          <ErrorMessage message={error} />
          {colorResult && (
            <div className="result-panel"><h3>Picked color</h3>
              <div className="color-result-row"><span className="color-swatch" style={{ background: colorResult.hex }} aria-label={colorResult.hex} /><div><p><strong>{colorResult.hex}</strong></p><p>{colorResult.rgb}</p></div></div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="tool-button-row"><button type="button" className="btn btn-primary" onClick={run}>{info.action}</button><DownloadButton href={output?.url} filename={output?.filename} disabled={!output}>Download result</DownloadButton></div>
          {loading && <LoadingSpinner label="Processing image..." />}
          <ErrorMessage message={error} />
          {output && <div className="info-note">Output created: <strong>{outputLabel}</strong></div>}
          <div className="preview-grid"><div><h4>Before</h4>{preview ? <img src={preview} alt="Original preview" /> : <p>No image selected yet.</p>}</div><div><h4>After</h4>{output?.url ? <img src={output.url} alt="Processed result" /> : <p>Processed output appears here.</p>}</div></div>
        </>
      )}
    </div>
  );
}

export { toolInfo };
export default ImageTransformTool;
