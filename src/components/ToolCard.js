import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import * as Icons from 'lucide-react';

function ToolCard({ tool, categoryColor }) {
  const Icon = Icons[tool.icon] || Icons.Wrench;
  const statusLabel = tool.status === 'ready' ? 'Ready' : tool.status === 'adapter' ? 'Adapter Required' : tool.status === 'limited' ? 'Limited' : 'Coming Soon';
  const statusClass = tool.status === 'ready' ? 'status-ready' : tool.status === 'adapter' ? 'status-adapter' : tool.status === 'limited' ? 'status-limited' : 'status-coming-soon';
  const actionLabel = tool.status === 'ready' ? 'Use Tool' : tool.status === 'adapter' ? 'Configure Adapter' : tool.status === 'limited' ? 'Use Tool (Limited)' : 'View Status';

  return (
    <Link to={`/tools/${tool.id}`} className="tool-card-link">
      <div className="tool-card-header">
        <div className="tool-card-icon" style={{ background: `${categoryColor}15`, color: categoryColor }}><Icon size={22} /></div>
        <div className="tool-card-badges">
          {tool.popular && <span className="popular-badge"><Star size={12} fill="currentColor" /> Popular</span>}
          <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className="tool-card-action"><span>{actionLabel}</span><ArrowRight size={16} /></div>
    </Link>
  );
}

export default ToolCard;
