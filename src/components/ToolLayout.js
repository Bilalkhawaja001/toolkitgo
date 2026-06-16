import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getToolById, getCategoryById } from '../data/toolsData';

function ToolLayout({ children }) {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : null;

  if (!tool || !category) return children;
  const statusLabel = tool.status === 'ready' ? 'Ready' : tool.status === 'adapter' ? 'Adapter Required' : tool.status === 'limited' ? 'Limited' : 'Coming Soon';
  const statusClass = tool.status === 'ready' ? 'status-ready' : tool.status === 'adapter' ? 'status-adapter' : tool.status === 'limited' ? 'status-limited' : 'status-coming-soon';

  return (
    <div className="tool-layout-shell">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/category/${category.id}`}>{category.name}</Link>
        <span>/</span>
        <strong>{tool.name}</strong>
      </div>
      <Link to={`/category/${category.id}`} className="back-link"><ArrowLeft size={20} /> Back to {category.name}</Link>
      <header className="tool-page-header">
        <div>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
      </header>
      <div className="animate-fade-in">{children}</div>
    </div>
  );
}

export default ToolLayout;
