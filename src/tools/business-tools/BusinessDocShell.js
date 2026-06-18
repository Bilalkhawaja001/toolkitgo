import React from 'react';

const DRAFT_NOTE = 'Draft saved locally in this browser only.';

// Shared presentational shell for the business document generators.
// Keeps status line, privacy/draft note, validation area and action buttons
// consistent without duplicating markup in each tool. Logic stays in the tools.
function BusinessDocShell({ toolId, title, subtitle, error, onDownload, onClear, downloadLabel = 'Download PDF', children }) {
  return (
    <div className="tool-card phase1b-tool business-tool" data-tool={toolId}>
      <div className="tool-status-line">
        <span className="status-ready">Working client-side</span>
        <span>{DRAFT_NOTE}</span>
      </div>
      <h2>{title}</h2>
      {subtitle && <p className="info-note">{subtitle}</p>}

      {children}

      {error && <p className="error-message" role="alert">{error}</p>}

      <div className="tool-button-row">
        <button type="button" className="btn btn-primary" onClick={onDownload}>{downloadLabel}</button>
        <button type="button" className="btn btn-secondary" onClick={onClear}>Clear / Reset</button>
      </div>
      <p className="draft-note">{DRAFT_NOTE}</p>
    </div>
  );
}

export default BusinessDocShell;
