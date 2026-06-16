import React, { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

function WordCounter() {
  const [text, setText] = useState('');
  const lines = text.length ? text.split(/\r?\n/) : [];

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
    paragraphs: text.trim() ? text.split(/(?:\r?\n){2,}/).filter(p => p.trim()).length : 0,
    lines: lines.length
  };

  const copyText = () => {
    if (navigator.clipboard && text) navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="tool-card">
        <div className="tool-action-row">
          <label>Enter your text:</label>
          <div>
            <button onClick={copyText} className="btn btn-secondary btn-sm"><Copy size={14} /> Copy</button>
            <button onClick={() => setText('')} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button>
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here..." className="form-textarea" style={{minHeight: 200, fontSize: '0.9375rem'}} />
      </div>

      <div className="stats-grid">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.characters },
          { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Lines', value: stats.lines }
        ].map((stat) => <div key={stat.label} className="stat-card"><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>
    </div>
  );
}

export default WordCounter;
