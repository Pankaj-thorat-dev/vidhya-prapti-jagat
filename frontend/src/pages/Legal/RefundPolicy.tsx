import React from 'react';

const RefundPolicy = () => {
  return (
    <div style={{ padding: '50px 20px', maxWidth: '900px', margin: '0 auto', color: '#4a5568', lineHeight: '1.8', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1a202c', borderBottom: '2px solid #ef4444', paddingBottom: '10px' }}>Cancellation and Refund Policy</h1>
      
      <section style={{ marginTop: '30px' }}>
        <div style={{ backgroundColor: '#fff5f5', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #ef4444', marginBottom: '30px' }}>
          <h2 style={{ color: '#c53030', marginTop: '0' }}>1. No Refunds for Digital Products</h2>
          <p>
            At <strong>Vidhya Prapti Jagat</strong>, we provide digital educational notes in PDF format. 
            Once a purchase is completed and the file access is granted, <strong>we do not offer any refunds or cancellations</strong>. All sales are final.
          </p>
        </div>

        <h2>2. Technical Support via WhatsApp</h2>
        <p>
          In case you face any issues while downloading your notes after a successful payment, please message us on our 
          <strong> Official WhatsApp Support Number: +91-8005685448</strong>. 
          Please share your payment screenshot, and we will manually send you the PDF file within 24 hours.
        </p>
        
        <h2>3. Payment Failures</h2>
        <p>
          If your money is deducted but the order is not confirmed, the amount will be automatically refunded to your bank account by the payment gateway (Razorpay) within 5-7 working days.
        </p>
      </section>
    </div>
  );
};

export default RefundPolicy;