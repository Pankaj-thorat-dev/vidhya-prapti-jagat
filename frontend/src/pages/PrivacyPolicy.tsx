import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>

        <p className="org-name">Vidhya Prapti Jagat, Atru</p>
        <p className="effective-date">
          <strong>Effective Date:</strong> 23 January 2026
        </p>

        <p className="intro">
          Vidhya Prapti Jagat, Atru (“we,” “our,” or “us”) is committed to
          protecting the privacy of our students, parents, and visitors. This
          Privacy Policy explains how we collect, use, and safeguard your
          information.
        </p>

        <section>
          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, phone number, email
              address, address, student details, and academic information
              provided during admission or inquiry.
            </li>
            <li>
              <strong>Payment Information:</strong> Fee-related details (we do
              not store sensitive banking or card information).
            </li>
            <li>
              <strong>Usage Information:</strong> Information about how you use
              our website or services, if applicable.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Provide coaching and educational services</li>
            <li>Manage admissions, attendance, and academic records</li>
            <li>Communicate important updates, notices, and results</li>
            <li>Improve our teaching services and student experience</li>
            <li>Process fees and maintain internal records</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do <strong>not sell, trade, or rent</strong> personal information
            to third parties. Information may be shared only:
          </p>
          <ul>
            <li>When required by law</li>
            <li>With trusted service providers strictly for operational purposes</li>
            <li>With parents/guardians regarding student performance</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to protect personal information from
            unauthorized access, misuse, or disclosure. However, no method of
            data transmission or storage is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Children’s Privacy</h2>
          <p>
            Our services are intended for students, including minors. We collect
            student information only with the knowledge and consent of parents or
            guardians.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <ul>
            <li>Access or update your personal information</li>
            <li>Request correction of incorrect data</li>
            <li>
              Request deletion of data, subject to legal or academic requirements
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            be posted on our website or notice board.
          </p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p className="contact">
            <strong>Vidhya Prapti Jagat, Atru</strong>
            <br />
            📍 Atru, Rajasthan
            <br />
            📞 8005685449
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
