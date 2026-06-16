import React from 'react';
import { Upload } from 'lucide-react';

function FileUploader({ label = 'Upload file', accept, multiple = false, onChange, helper }) {
  return (
    <label className="file-uploader">
      <Upload size={28} />
      <strong>{label}</strong>
      {helper && <span>{helper}</span>}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => onChange(multiple ? Array.from(event.target.files || []) : event.target.files?.[0] || null)}
      />
    </label>
  );
}

export default FileUploader;
