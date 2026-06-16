import React from 'react';
import OfficeToPdfTool from './OfficeToPdfTool';

function PptToPdf() {
  return <OfficeToPdfTool type="powerpoint" title="PowerPoint" extensions={['.ppt', '.pptx']} accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" />;
}

export default PptToPdf;
