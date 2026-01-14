import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📚 VPJ</h3>
          <p>Your gateway to academic excellence. Quality study notes for every student.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            {/* <li><a href="mailto:support@noteshub.com">Email Support</a></li> */}
            <li><a href="tel:+918005685448">Call Us</a></li>
            <li><Link to="/contact">Contact Form</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          {/* <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div> */}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Vidhya Prapti jagat. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
