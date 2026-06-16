import React from 'react';

function LoadingSpinner({ label = 'Processing...' }) {
  return <div className="loading-spinner" aria-live="polite"><span /> {label}</div>;
}

export default LoadingSpinner;
