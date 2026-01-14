import React from 'react';
import Hero from '../components/Hero';
import Boards from '../components/Boards';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Hero />
      <Boards />
      
      <section className="features">
        <div className="features-container">
          <h2>Why Choose Vidhya Prapti jagat ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Quality Content</h3>
              <p>Curated notes from top educators and subject experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Access</h3>
              <p>Download notes immediately after purchase</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment gateway integration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Exam Focused</h3>
              <p>Content aligned with latest syllabus and exam patterns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
