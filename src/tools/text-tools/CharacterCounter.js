import React, { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

function CharacterCounter() {
  const [text, setText] = useState('');

  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const spaces = (text.match(/\s/g) || []).length;

  return (
    <div>
      <div className="tool-card">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
          <label style={{fontWeight: 600, color: '#374151'}}>Enter your text:</label>
          <div style={{display: 'flex', gap: 8}}>
            <button onClick={() => navigator.clipboard.writeText(text)} className="btn btn-secondary btn-sm"><Copy size={14} /> Copy</button>
            <button onClick={() => setText('')} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button>
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here..." className="form-textarea" style={{minHeight: 200}} />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12}}>
        {[
          { label: 'Total Characters', value: text.length },
          { label: 'Letters', value: letters },
          { label: 'Digits', value: digits },
          { label: 'Symbols', value: symbols },
          { label: 'Spaces', value: spaces },
          { label: 'Without Spaces', value: text.length - spaces }
        ].map((stat, i) => (
          <div key={i} style={{background: '#fff', borderRadius: 12, padding: '16px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#2563eb'}}>{stat.value}</div>
            <div style={{fontSize: '0.75rem', color: '#6b7280', marginTop: 4}}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterCounter;
