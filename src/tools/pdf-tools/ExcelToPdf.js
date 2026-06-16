import React from 'react';
import OfficeToPdfTool from './OfficeToPdfTool';

function ExcelToPdf() {
  return <OfficeToPdfTool type="excel" title="Excel" extensions={['.xls', '.xlsx']} accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />;
}

export default ExcelToPdf;
