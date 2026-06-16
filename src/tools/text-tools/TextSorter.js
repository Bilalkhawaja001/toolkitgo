import React, { useMemo, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

function TextSorter() {
  const [text, setText] = useState('');
  const [sortType, setSortType] = useState('alpha');

  const result = useMemo(() => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    const sorted = [...lines];
    if (sortType === 'alpha') sorted.sort((a, b) => a.localeCompare(b));
    else if (sortType === 'alpha-desc') sorted.sort((a, b) => b.localeCompare(a));
    else if (sortType === 'length') sorted.sort((a, b) => a.length - b.length || a.localeCompare(b));
    else if (sortType === 'length-desc') sorted.sort((a, b) => b.length - a.length || a.localeCompare(b));
    else if (sortType === 'reverse') sorted.reverse();
    return sorted.join('\n');
  }, [text, sortType]);

  const copyResult = () => {
    if (navigator.clipboard && result) navigator.clipboard.writeText(result);
  };

  const options = [
    { id: 'alpha', label: 'A-Z' },
    { id: 'alpha-desc', label: 'Z-A' },
    { id: 'length', label: 'Shortest First' },
    { id: 'length-desc', label: 'Longest First' },
    { id: 'reverse', label: 'Reverse' }
  ];

  return (
    <div className="tool-card">
      <div className="tool-action-row"><label>Input Lines:</label><button onClick={() => setText('')} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste lines to sort..." className="form-textarea" style={{minHeight: 150}} />
      <div className="option-row">{options.map(opt => <button key={opt.id} onClick={() => setSortType(opt.id)} className={sortType === opt.id ? 'option-button active' : 'option-button'}>{opt.label}</button>)}</div>
      <label className="field-title">Sorted Result:</label>
      <div className="textarea-with-action"><textarea value={result} readOnly className="form-textarea" style={{minHeight: 150, background: '#f9fafb'}} /><button onClick={copyResult} className="btn btn-secondary btn-sm"><Copy size={14} /> Copy</button></div>
    </div>
  );
}

export default TextSorter;
