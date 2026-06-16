import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand">
              <Wrench size={24} />
              <span>FreeTools</span>
            </Link>
            <p className="footer-desc">A clean demo skeleton for free online tools. Ready text tools work in the browser; planned tools are marked Coming Soon.</p>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>
              <li><Link to="/category/text-tools">Text Tools</Link></li>
              <li><Link to="/category/business-tools">Business Tools</Link></li>
              <li><Link to="/category/calculator-tools">Calculators</Link></li>
              <li><Link to="/category/developer-tools">Developer Tools</Link></li>
              <li><Link to="/category/qr-tools">QR & Barcodes</Link></li>
              <li><Link to="/category/image-tools">Image & File Tools</Link></li>
              <li><Link to="/category/pdf-tools">PDF & Documents</Link></li>
              <li><Link to="/category/social-tools">Social Media</Link></li>
            </ul>
          </div>
          <div>
            <h4>Popular Tools</h4>
            <ul>
              <li><Link to="/tool/word-counter">Word Counter</Link></li>
              <li><Link to="/tool/case-converter">Case Converter</Link></li>
              <li><Link to="/tool/text-to-slug">Text to Slug</Link></li>
              <li><Link to="/tool/qr-code-generator">QR Code Generator</Link></li>
              <li><Link to="/tool/image-resize">Image Resize</Link></li>
              <li><Link to="/tool/image-to-pdf">Image to PDF</Link></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Made with <Heart size={14} /> for practical browser utilities</p>
          <p>{new Date().getFullYear()} FreeTools</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
