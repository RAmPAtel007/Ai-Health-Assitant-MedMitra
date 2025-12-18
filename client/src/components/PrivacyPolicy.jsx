import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoMedical, IoLockClosed } from 'react-icons/io5';

const PrivacyPolicy = () => {
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

        .feature-box { background: white; padding: 35px; border-radius: 16px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
        .feature-box h3 { color: #2d3748; font-size: 22px; margin-bottom: 10px; font-weight: 700; }
        .feature-box p { margin: 0; }

        .simple-footer { background: white; padding: 30px; text-align: center; margin-top: 60px; border-top: 1px solid #e2e8f0; }
        .simple-footer p { color: #718096; font-size: 16px; margin: 0; }
      `}</style>

      <div className="page-container">
        <header className="page-header">
          <div className="logo-section">
            <div className="logo-icon"><IoMedical /></div>
            <span className="logo-text">MedMitra</span>
          </div>
          <button className="back-btn" onClick={() => navigate('/home')}>
            <IoArrowBack /> Back
          </button>
        </header>

        <section className="hero-section">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">Your health data is yours. We protect it.</p>
        </section>

        <div className="page-content">
          <div className="content-section">
            <h2>1. Information We Collect</h2>
            <p>To provide you with the best healthcare assistance, MedMitra collects the following types of information:</p>
            <ul className="benefits-list">
              <li><strong>Personal Information:</strong> Name, age, gender, and contact details provided during registration.</li>
              <li><strong>Health Data:</strong> Symptoms, vaccination history, and basic medical profiles you voluntarily share.</li>
              <li><strong>Location Data:</strong> Used strictly for the "Hospital Finder" and "Emergency Alert" features.</li>
            </ul>
          </div>

          <div className="content-section">
            <h2>2. How We Use Your Data</h2>
            <p>We use your data solely to:</p>
            <ul className="benefits-list">
              <li>Provide accurate, AI-driven health suggestions.</li>
              <li>Send vaccination reminders and outbreak alerts relevant to your area.</li>
              <li>Connect you with emergency contacts during SOS triggers.</li>
            </ul>
            <p><strong>We do not sell your personal data to third-party advertisers.</strong></p>
          </div>

          <div className="content-section">
            <h2>3. Data Security</h2>
            <div className="feature-box">
              <IoLockClosed size={50} color="#667eea" />
              <div>
                <h3>End-to-End Encryption</h3>
                <p>All conversations with the MedMitra bot and your personal health records are encrypted both in transit and at rest.</p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2>4. Your Rights</h2>
            <p>You have the right to access, update, or delete your profile at any time via the "Edit Profile" section on your dashboard.</p>
          </div>
        </div>

        <footer className="simple-footer">
          <p>© 2025 MedMitra. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicy;