import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Layers } from 'lucide-react';
import { getReadyTools, getComingSoonTools, categories } from '../data/toolsData';

function HeroSection() {
  const stats = [
    { icon: Zap, value: getReadyTools().length, label: 'Ready text tools' },
    { icon: Layers, value: categories.length, label: 'Categories' },
    { icon: Shield, value: getComingSoonTools().length, label: 'Coming soon tools' }
  ];
  const features = [
    { icon: Zap, title: 'Fast browser tools', desc: 'Implemented text tools run instantly in the browser.' },
    { icon: Shield, title: 'Honest status', desc: 'Unfinished tools are clearly marked Coming Soon instead of showing fake outputs.' },
    { icon: Layers, title: 'Demo-ready skeleton', desc: 'Clean navigation, category pages, and responsive tool cards are in place.' }
  ];

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1>Free Online <span>Tools</span></h1>
          <p>Fast browser-based utilities with clear categories, working text tools, and honest Coming Soon states for planned tools.</p>
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat">
                <stat.icon size={24} />
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
          <Link to="/category/text-tools" className="btn btn-primary btn-lg">Explore ready tools <ArrowRight size={20} /></Link>
        </div>
        <div className="hero-features">
          {features.map((feature, i) => (
            <div key={i} className="hero-feature">
              <div><feature.icon size={28} /></div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
