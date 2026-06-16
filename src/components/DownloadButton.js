import React from 'react';
import { Download } from 'lucide-react';

function DownloadButton({ href, filename, disabled, children = 'Download' }) {
  if (disabled || !href) {
    return <button type="button" className="btn btn-secondary" disabled><Download size={16} /> {children}</button>;
  }

  return <a className="btn btn-primary" href={href} download={filename}><Download size={16} /> {children}</a>;
}

export default DownloadButton;
