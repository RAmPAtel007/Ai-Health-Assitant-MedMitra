import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoMedical, IoWarning } from 'react-icons/io5';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .page-container { min-height: 100vh; background: linear-gradient(to bottom, #f3f4ff 0%, #e8eaff 100%); font-family: 'Inter', sans-serif; }
        
        .page-header { background: white; padding: 20px 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
        .logo-text { font-size: 24px; font-weight: 700; color: #6b46c1; }
        .back-btn { display: flex; align-items: center; gap: 10px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
        .back-btn:hover { transform: translateX(-5px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }

        .hero-section { text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .hero-section h1 { font-size: 48px; margin-bottom: 15px; font-weight: 800; }
        .hero-subtitle { font-size: 20px; opacity: 0.95; font-weight: 500; }

        .page-content { max-width: 1000px; margin: 0 auto; padding: 60px 40px; }
        .content-section { background: white; padding: 40px; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); }
        .content-section h2 { color: #2d3748; font-size: 32px; margin-bottom: 20px; font-weight: 700; }
        .content-section p { color: #4a5568; font-size: 18px; line-height: 1.8; margin-bottom: 15px; }

        .benefits-list { list-style: none; padding: 0; }
        .benefits-list li { color: #4a5568; font-size: 18px; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }

        .simple-footer { background: white; padding: 30px; text-align: center; margin-top: 60px; border-top: 1px solid #e2e8f0; }
        .simple-footer p { color: #718096; font-size: 16px; margin: 0; }
      `}</style>

      <div className="page-container">
        <header className="page-header">
          <div className="logo-section">
            <div className="logo-icon"><IoMedical /></div>
            <span className="logo-text">MedMitra</span>
          </div>
          <button className="back-btn" onClick={() => navigate('/')}>
            <IoArrowBack /> Back
          </button>
        </header>

        <section className="hero-section">
          <h1>Terms of Service</h1>
          <p className="hero-subtitle">Please read these terms carefully before using MedMitra.</p>
        </section>

        <div className="page-content">
          <div className="content-section" style={{ borderLeft: '5px solid #ef4444' }}>
            <h2 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IoWarning /> Medical Disclaimer
            </h2>
            <p><strong>MedMitra is an AI-assisted tool, not a doctor.</strong></p>
            <p>
              The information provided by this application is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. <strong>In case of a medical emergency, call your local emergency services immediately.</strong>
            </p>
          </div>

          <div className="content-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By creating an account or using MedMitra, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.</p>
          </div>

          <div className="content-section">
            <h2>2. User Responsibilities</h2>
            <ul className="benefits-list">
              <li>You agree to provide accurate and current information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You agree not to misuse the Emergency Alert feature for non-emergency situations.</li>
            </ul>
          </div>

          <div className="content-section">
            <h2>3. Limitation of Liability</h2>
            <p>MedMitra and its developers shall not be held liable for any damages arising out of or in connection with the use or inability to use this application.</p>
          </div>
        </div>

        <footer className="simple-footer">
          <p>© 2025 MedMitra. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default TermsOfService;