import React, { useMemo, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

const toTitleCase = (value) => value
  .toLowerCase()
  .replace(/(^|[^\p{L}\p{N}])([\p{L}\p{N}])/gu, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);

const convertText = (value, type) => {
  switch (type) {
    case 'upper': return value.toUpperCase();
    case 'lower': return value.toLowerCase();
    case 'title': return toTitleCase(value);
    case 'sentence': return value.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s*[a-z])/g, c => c.toUpperCase());
    case 'camel': return value.toLowerCase().trim().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
    case 'snake': return value.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').replace(/_+/g, '_');
    case 'kebab': return value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    default: return value;
  }
};

function CaseConverter() {
  const [text, setText] = useState('');
  const [activeCase, setActiveCase] = useState('');
  const converted = useMemo(() => activeCase ? convertText(text, activeCase) : '', [text, activeCase]);
  const copyConverted = () => { if (navigator.clipboard && converted) navigator.clipboard.writeText(converted); };

  const cases = [
    { id: 'upper', label: 'UPPERCASE', desc: 'ALL CAPS' },
    { id: 'lower', label: 'lowercase', desc: 'all small' },
    { id: 'title', label: 'Title Case', desc: 'First Letter Caps' },
    { id: 'sentence', label: 'Sentence case', desc: 'First word caps' },
    { id: 'camel', label: 'camelCase', desc: 'camelCase' },
    { id: 'snake', label: 'snake_case', desc: 'underscore' },
    { id: 'kebab', label: 'kebab-case', desc: 'hyphen' }
  ];

  return (
    <div className="tool-card">
      <div className="tool-action-row"><label>Input Text:</label><button onClick={() => { setText(''); setActiveCase(''); }} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to convert..." className="form-textarea" style={{minHeight: 120}} />
      <div className="case-grid">{cases.map(c => <button key={c.id} onClick={() => setActiveCase(c.id)} className={activeCase === c.id ? 'case-button active' : 'case-button'}><span>{c.label}</span><small>{c.desc}</small></button>)}</div>
      <label className="field-title">Converted Text:</label>
      <div className="textarea-with-action"><textarea value={converted} readOnly className="form-textarea" style={{minHeight: 120, background: '#f9fafb'}} /><button onClick={copyConverted} className="btn btn-secondary btn-sm"><Copy size={14} /> Copy</button></div>
    </div>
  );
}

export default CaseConverter;
