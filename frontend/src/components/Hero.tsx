import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        
        <h1 className="hero-title">आपके राजस्थान में शिक्षा की एक नई संस्था,
          जो करेगी विद्यार्थियों की समस्याओं का समाधान।</h1>

        <h2>RBSE बोर्ड 2026 वाले विद्यार्थियों के लिए
        </h2>

        <h3>Vidhya Prapti jagat</h3>

        <p className="hero-subtitle">
          12 वर्षों के PYQ के विश्लेषण से तैयार किया गया
          अध्यायवार ब्लूप्रिंट के अनुसार सबसे महत्वपूर्ण प्रश्न
        </p>

        <h4>Question Made By 15 Yrs +Experience Faculty</h4>
        <div className="hero-buttons">
          <Link to="/shop" className="btn-primary">Browse Notes</Link>
          <Link to="/contact" className="btn-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
