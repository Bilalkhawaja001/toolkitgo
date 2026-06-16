import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import CategoryCard from '../components/CategoryCard';
import ToolCard from '../components/ToolCard';
import { categories, getPopularTools, getCategoryById } from '../data/toolsData';

function HomePage() {
  const popularTools = getPopularTools();

  return (
    <div>
      <Helmet>
        <title>Free Online Tools - Browser Utility Demo</title>
        <meta name="description" content="Free online tools skeleton with working text utilities, category browsing, and Coming Soon placeholders for planned tools." />
      </Helmet>
      <HeroSection />

      <section className="section-block">
        <div className="container">
          <div className="section-heading">
            <h2>Browse by Category</h2>
            <p>Find the right tool quickly. Ready tools and planned tools are clearly labeled.</p>
          </div>
          <div className="responsive-grid category-grid">
            {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        </div>
      </section>

      <section className="section-block muted-section">
        <div className="container">
          <div className="section-heading">
            <h2>Popular Tools</h2>
            <p>Ready tools open directly; planned tools open a professional Coming Soon screen.</p>
          </div>
          <div className="responsive-grid tools-grid">
            {popularTools.map(tool => {
              const cat = getCategoryById(tool.category);
              return <ToolCard key={tool.id} tool={tool} categoryColor={cat.color} />;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
