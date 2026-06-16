import React, { useMemo, useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function FindAndReplace() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const { result, matches } = useMemo(() => {
    if (!find) return { result: text, matches: 0 };
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(escapeRegExp(find), flags);
    return { result: text.replace(regex, replace), matches: (text.match(regex) || []).length };
  }, [text, find, replace, caseSensitive]);

  const clear = () => { setText(''); setFind(''); setReplace(''); };
  const copyResult = () => { if (navigator.clipboard && result) navigator.clipboard.writeText(result); };

  return (
    <div className="tool-card">
      <div className="two-column-form">
        <div><label className="field-title">Find:</label><input type="text" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Text to find..." className="form-input" /></div>
        <div><label className="field-title">Replace with:</label><input type="text" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replacement text..." className="form-input" /></div>
      </div>
      <label className="inline-check"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} /> Case sensitive</label>
      <div className="tool-action-row"><label>Input Text:</label><button onClick={clear} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text here..." className="form-textarea" style={{minHeight: 120}} />
      <label className="field-title">Result:</label>
      <div className="textarea-with-action"><textarea value={result} readOnly className="form-textarea" style={{minHeight: 120, background: '#f9fafb'}} /><button onClick={copyResult} className="btn btn-secondary btn-sm"><Copy size={14} /> Copy</button></div>
      {find && <div className="info-note">Found <strong>{matches}</strong> match{matches !== 1 ? 'es' : ''}</div>}
    </div>
  );
}

export default FindAndReplace;
