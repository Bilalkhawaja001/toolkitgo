import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Briefcase,
  Calculator,
  CheckCircle2,
  Code,
  FileText,
  Image,
  Layers,
  Menu,
  MoreHorizontal,
  QrCode,
  Search,
  Server,
  Share2,
  Sparkles,
  Type,
  Wrench,
  X
} from 'lucide-react';
import { categories, searchTools, tools } from '../data/toolsData';

const CATEGORY_CONFIG = {
  'pdf-tools': { label: 'PDF Tools', navLabel: 'PDF Tools', color: 'pdf', icon: FileText },
  'image-tools': { label: 'Image Tools', navLabel: 'Image Tools', color: 'image', icon: Image },
  'text-tools': { label: 'Text Tools', navLabel: 'Text Tools', color: 'text', icon: Type },
  'qr-tools': { label: 'QR & Barcode', navLabel: 'QR & Barcode', color: 'qr', icon: QrCode },
  'calculator-tools': { label: 'Calculators', navLabel: 'Calculators', color: 'calculator', icon: Calculator },
  'developer-tools': { label: 'Developer Tools', navLabel: 'Developer Tools', color: 'developer', icon: Code },
  'business-tools': { label: 'Business Tools', navLabel: 'Business Tools', color: 'business', icon: Briefcase },
  'social-tools': { label: 'Social/Other', navLabel: 'Social/Other', color: 'social', icon: Share2 }
};

const PRIMARY_GROUPS = ['pdf-tools', 'image-tools', 'text-tools'];
const MORE_GROUPS = ['qr-tools', 'calculator-tools', 'developer-tools', 'business-tools', 'social-tools'];
const BACKEND_REQUIRED_TOOL_IDS = new Set([
  'background-remover',
  'image-enhancer',
  'word-to-pdf',
  'excel-to-pdf',
  'powerpoint-to-pdf',
  'redact-pdf'
]);

const statusMeta = {
  ready: { label: 'Ready', className: 'status-working', icon: CheckCircle2 },
  limited: { label: 'Limited', className: 'status-limited', icon: AlertTriangle },
  adapter: { label: 'Adapter Required', className: 'status-backend', icon: Server },
  'coming-soon': { label: 'Coming Soon', className: 'status-soon', icon: Sparkles }
};

const getToolStatus = (tool) => BACKEND_REQUIRED_TOOL_IDS.has(tool.id) ? 'adapter' : tool.status;
const getCategoryConfig = (categoryId) => CATEGORY_CONFIG[categoryId] || { label: categoryId, navLabel: categoryId, color: 'default', icon: Layers };
const isDenseMenuTool = (tool) => getToolStatus(tool) !== 'coming-soon';

function getCategoryTools(categoryId, { includePlaceholders = false } = {}) {
  return tools
    .filter((tool) => tool.category === categoryId)
    .filter((tool) => includePlaceholders || isDenseMenuTool(tool))
    .sort((a, b) => Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name));
}

function StatusChip({ tool }) {
  const key = getToolStatus(tool);
  const meta = statusMeta[key] || statusMeta['coming-soon'];
  const Icon = meta.icon;
  return (
    <span className={`tool-status-chip ${meta.className}`}>
      <Icon size={11} />
      {meta.label}
    </span>
  );
}

function ToolTypeIcon({ categoryId, name }) {
  const config = getCategoryConfig(categoryId);
  const Icon = config.icon;
  return (
    <span className={`tool-type-icon tool-type-${config.color}`} aria-hidden="true">
      <Icon size={18} />
      <span>{name.slice(0, 1).toUpperCase()}</span>
    </span>
  );
}

function ToolMenuItem({ tool }) {
  return (
    <Link to={`/tools/${tool.id}`} className="tool-menu-item">
      <ToolTypeIcon categoryId={tool.category} name={tool.name} />
      <span className="tool-menu-copy">
        <span className="tool-menu-title-row">
          <span className="tool-menu-title">{tool.name}</span>
          <StatusChip tool={tool} />
        </span>
        <small>{tool.description}</small>
      </span>
    </Link>
  );
}

function MegaMenuSection({ title, categoryId, items, emptyText }) {
  const config = getCategoryConfig(categoryId);
  const Icon = config.icon;
  return (
    <section className={`mega-menu-section mega-section-${config.color}`}>
      <h4>
        <span className={`mega-section-icon tool-type-${config.color}`}><Icon size={15} /></span>
        {title}
      </h4>
      {items.length > 0 ? (
        <div className="mega-menu-items">
          {items.map((tool) => <ToolMenuItem key={tool.id} tool={tool} />)}
        </div>
      ) : (
        <p className="mega-menu-empty">{emptyText || 'Registered tools are listed under All Tools.'}</p>
      )}
    </section>
  );
}

function MegaMenu({ label, icon: Icon, sections, allTools = false }) {
  return (
    <div className={`navbar-mega-wrap ${allTools ? 'navbar-mega-all' : ''}`}>
      <button type="button" className="pdf-main-nav-link mega-trigger">
        <Icon size={16} />
        {label}
        <span className="mega-caret">⌄</span>
      </button>
      <div className="navbar-mega-panel">
        <div className="navbar-mega-head">
          <strong>{label}</strong>
          <span>{allTools ? 'All registered ToolKitGo routes' : 'Registered tools only — no broken slugs'}</span>
        </div>
        <div className="navbar-mega-grid">
          {sections.map((section) => (
            <MegaMenuSection
              key={section.categoryId}
              title={section.title}
              categoryId={section.categoryId}
              items={section.items}
              emptyText={section.emptyText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const results = useMemo(() => searchTools(searchQuery).slice(0, 6), [searchQuery]);
  const hasQuery = searchQuery.trim().length > 0;

  const closeMenus = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const primarySections = useMemo(() => PRIMARY_GROUPS.map((categoryId) => ({
    categoryId,
    title: getCategoryConfig(categoryId).label,
    items: getCategoryTools(categoryId)
  })), []);

  const moreSections = useMemo(() => MORE_GROUPS.map((categoryId) => ({
    categoryId,
    title: getCategoryConfig(categoryId).label,
    items: getCategoryTools(categoryId),
    emptyText: 'No live tools in this group yet. Registered placeholders are available under All Tools.'
  })), []);

  const allSections = useMemo(() => categories.map((category) => ({
    categoryId: category.id,
    title: getCategoryConfig(category.id).label,
    items: getCategoryTools(category.id, { includePlaceholders: true })
  })), []);

  return (
    <nav className="site-navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenus}>
          <Wrench size={28} />
          <span>ToolKitGo</span>
        </Link>

        <div className="navbar-search-wrap">
          <Search size={18} className="navbar-search-icon" />
          <input
            type="search"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
            aria-label="Search tools"
          />
          {hasQuery && (
            <div className="search-results-panel">
              {results.length > 0 ? results.map(tool => (
                <Link key={tool.id} to={`/tools/${tool.id}`} className="search-result-item" onClick={closeMenus}>
                  <span>{tool.name}</span>
                  <StatusChip tool={tool} />
                </Link>
              )) : (
                <div className="search-empty">No tools found</div>
              )}
            </div>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation" aria-expanded={isOpen}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${isOpen ? 'is-open' : ''}`}>
          {primarySections.map((section) => {
            const config = getCategoryConfig(section.categoryId);
            return <MegaMenu key={section.categoryId} label={config.navLabel} icon={config.icon} sections={[section]} />;
          })}
          <MegaMenu label="More Tools" icon={MoreHorizontal} sections={moreSections} />
          <MegaMenu label="All Tools" icon={Layers} sections={allSections} allTools />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
