export const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

export const validateImageFile = (file) => {
  if (!file) return 'Choose an image file first.';
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Unsupported file type. Use JPG, PNG, or WEBP.';
  if (file.size > MAX_IMAGE_SIZE) return 'File is too large. Maximum size is 20MB.';
  return '';
};

export const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('Could not read the image file.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('Could not load the image.'));
    image.onload = () => resolve({ image, dataUrl: reader.result });
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

export const canvasToBlob = (canvas, type, quality) => new Promise((resolve) => {
  canvas.toBlob((blob) => resolve(blob), type, quality);
});

export const blobToDownload = (blob) => ({
  url: URL.createObjectURL(blob),
  size: blob.size
});

export const drawImageToCanvas = (image, width, height, mimeType = 'image/png') => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
};
