import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getToolsByCategory } from '../data/toolsData';

function CategoryCard({ category }) {
  const Icon = Icons[category.icon] || Icons.Wrench;
  const tools = getToolsByCategory(category.id);
  const readyCount = tools.filter(tool => tool.status === 'ready').length;

  return (
    <Link to={`/category/${category.id}`} className="category-card" style={{ borderColor: `${category.color}20` }}>
      <div className="category-card-icon" style={{ background: `${category.color}15`, color: category.color }}>
        <Icon size={32} />
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <div className="category-card-footer">
        <span style={{ background: `${category.color}15`, color: category.color }}>{readyCount}/{tools.length} ready</span>
        <ArrowRight size={18} style={{ color: category.color }} />
      </div>
    </Link>
  );
}

export default CategoryCard;
