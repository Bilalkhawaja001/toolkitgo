import React, { useMemo, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

function DuplicateLineRemover() {
  const [text, setText] = useState('');
  const [sort, setSort] = useState(false);

  const { lines, uniqueLines, result, removed } = useMemo(() => {
    const currentLines = text.length ? text.split(/\r?\n/) : [];
    const deduped = [...new Set(currentLines)];
    const finalLines = sort ? deduped.sort((a, b) => a.localeCompare(b)) : deduped;
    return {
      lines: currentLines,
      uniqueLines: finalLines,
      result: finalLines.join('\n'),
      removed: currentLines.length - finalLines.length
    };
  }, [text, sort]);

  const copyResult = () => {
    if (navigator.clipboard && result) navigator.clipboard.writeText(result);
  };

  return (
    <div className="tool-card">
      <div className="tool-action-row"><label>Input Lines:</label><button onClick={() => setText('')} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste lines of text here..." className="form-textarea" style={{minHeight: 150}} />
      <label className="inline-check"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} /> Sort alphabetically</label>
      <label className="field-title">Result:</label>
      <div className="textarea-with-action"><textarea value={result} readOnly className="form-textarea" style={{minHeight: 150, background: '#f9fafb'}} /><button onClick={copyResult} className="btn btn-secondary btn-sm"><Copy size={14} /> Copy</button></div>
      <div className="summary-row"><span>Original: {lines.length} lines</span><span>Unique: {uniqueLines.length} lines</span><span>Removed: {removed} duplicates</span></div>
    </div>
  );
}

export default DuplicateLineRemover;
