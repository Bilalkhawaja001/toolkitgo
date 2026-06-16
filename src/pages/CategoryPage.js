import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { getCategoryById, getToolsByCategory } from '../data/toolsData';

function CategoryPage() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const tools = getToolsByCategory(categoryId);
  const readyCount = tools.filter(tool => tool.status === 'ready').length;

  if (!category) {
    return (
      <div className="empty-state">
        <h1>Category Not Found</h1>
        <p>The category you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{category.name} - Free Online Tools</title>
        <meta name="description" content={category.description} />
      </Helmet>
      <div className="category-hero">
        <div className="container">
          <Link to="/" className="category-back"><ArrowLeft size={18} /> Back to Home</Link>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <span>{readyCount} ready / {tools.length} listed</span>
        </div>
      </div>
      <div className="section-block">
        <div className="container">
          <div className="responsive-grid tools-grid">
            {tools.map(tool => <ToolCard key={tool.id} tool={tool} categoryColor={category.color} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
