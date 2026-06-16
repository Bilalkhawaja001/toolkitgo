const missingConfig = (message) => {
  const error = new Error(message);
  error.code = 'CONFIG_REQUIRED';
  return error;
};

const buildHeaders = (apiKey) => apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

const postFileForBlob = async ({ url, apiKey, file, fieldName = 'file', extraFields = {} }) => {
  const formData = new FormData();
  formData.append(fieldName, file);
  Object.entries(extraFields).forEach(([key, value]) => formData.append(key, typeof value === 'string' ? value : JSON.stringify(value)));

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(apiKey),
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Backend request failed with status ${response.status}.`);
  }

  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error('Backend returned no output file.');
  }
  return blob;
};

export const removeBackground = async (imageFile) => {
  const url = process.env.REACT_APP_BACKGROUND_REMOVER_API_URL;
  const apiKey = process.env.REACT_APP_BACKGROUND_REMOVER_API_KEY;
  if (!url || !apiKey) {
    throw missingConfig('Background remover API is not configured yet.');
  }
  return postFileForBlob({ url, apiKey, file: imageFile, fieldName: 'image' });
};

export const enhanceImage = async (imageFile, options) => {
  const url = process.env.REACT_APP_IMAGE_ENHANCER_API_URL;
  const apiKey = process.env.REACT_APP_IMAGE_ENHANCER_API_KEY;
  if (!url || !apiKey) {
    throw missingConfig('Image enhancer API is not configured yet.');
  }
  return postFileForBlob({ url, apiKey, file: imageFile, fieldName: 'image', extraFields: { options } });
};

export const convertOfficeToPdf = async (file, type) => {
  const url = process.env.REACT_APP_OFFICE_TO_PDF_API_URL;
  const apiKey = process.env.REACT_APP_OFFICE_TO_PDF_API_KEY;
  if (!url || !apiKey) {
    throw missingConfig('Office to PDF conversion requires server-side setup. Backend adapter is ready but not configured.');
  }
  return postFileForBlob({ url, apiKey, file, fieldName: 'file', extraFields: { type } });
};

export const pdfToImageAdapter = async () => {
  throw missingConfig('PDF to Image conversion requires PDF rendering setup. Adapter is ready but not configured.');
};
