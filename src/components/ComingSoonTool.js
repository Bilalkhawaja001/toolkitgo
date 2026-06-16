import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, Wrench } from 'lucide-react';
import { getCategoryById } from '../data/toolsData';

function ComingSoonTool({ tool }) {
  const category = tool ? getCategoryById(tool.category) : null;

  return (
    <div className="coming-soon-card">
      <div className="coming-soon-icon"><Clock size={32} /></div>
      <span className="status-badge status-coming-soon">Coming Soon</span>
      <h2>{tool?.name || 'Tool'}</h2>
      {category && <p className="coming-soon-category">{category.name}</p>}
      <p className="coming-soon-copy">This tool UI is under design. It is listed so the demo navigation is complete, but no unfinished tool processing is shown here.</p>
      <div className="coming-soon-actions">
        {category && (
          <Link to={`/category/${category.id}`} className="btn btn-primary">
            <ArrowLeft size={16} /> Back to {category.name}
          </Link>
        )}
        <Link to="/" className="btn btn-secondary">
          <Wrench size={16} /> Browse tools
        </Link>
      </div>
    </div>
  );
}

export default ComingSoonTool;
