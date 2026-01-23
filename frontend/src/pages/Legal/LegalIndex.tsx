import React from 'react';
import { Link } from 'react-router-dom'; // Agar aap React Router use kar rahe hain

const LegalIndex = () => {
  const policies = [
    {
      title: "Contact Us",
      description: "Get in touch with our support team for any queries regarding notes.",
      link: "/contact"
    },
    {
      title: "Terms and Conditions",
      description: "Read the rules and regulations for using our educational platform.",
      link: "/terms"
    },
    {
      title: "Shipping and Delivery",
      description: "Information about how you receive your digital PDF notes after purchase.",
      link: "/shipping"
    },
    {
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information and data.",
      link: "/Privacy"
    },
    {
      title: "Cancellation and Refund",
      description: "Our policy on order cancellations and payment refunds for digital goods.",
      link: "/refund"
    }
  ];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', color: '#1a202c', marginBottom: '10px' }}>Legal & Policy Center</h1>
        <p style={{ color: '#718096', fontSize: '18px' }}>Everything you need to know about our services and your rights at Vidhya Prapti Jagat.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {policies.map((policy, index) => (
          <div key={index} style={{
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '22px', color: '#4f46e5', marginBottom: '12px' }}>{policy.title}</h2>
            <p style={{ color: '#4a5568', marginBottom: '20px', minHeight: '50px' }}>{policy.description}</p>
            <Link to={policy.link} style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              View Policy
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', padding: '20px', borderTop: '1px solid #edf2f7' }}>
        <p style={{ color: '#a0aec0' }}>© 2026 Vidhya Prapti Jagat. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LegalIndex;