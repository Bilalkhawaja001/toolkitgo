import React from 'react';
import OfficeToPdfTool from './OfficeToPdfTool';

function WordToPdf() {
  return <OfficeToPdfTool type="word" title="Word" extensions={['.doc', '.docx']} accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />;
}

export default WordToPdf;
