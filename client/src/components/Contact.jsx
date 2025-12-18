import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoMedical, IoMail, IoCall, IoLocation, IoSend } from 'react-icons/io5';

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you shortly.");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .page-container { min-height: 100vh; background: linear-gradient(to bottom, #f3f4ff 0%, #e8eaff 100%); font-family: 'Inter', sans-serif; }
        
        /* Header */
        .page-header { background: white; padding: 20px 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
        .logo-text { font-size: 24px; font-weight: 700; color: #6b46c1; }
        .back-btn { display: flex; align-items: center; gap: 10px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
        .back-btn:hover { transform: translateX(-5px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }

        /* Hero */
        .hero-section { text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .hero-section h1 { font-size: 48px; margin-bottom: 15px; font-weight: 800; }
        .hero-subtitle { font-size: 20px; opacity: 0.95; font-weight: 500; }

        /* Content */
        .page-content { max-width: 1000px; margin: 0 auto; padding: 60px 40px; }
        .content-section { background: white; padding: 40px; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); }
        .content-section h2 { color: #2d3748; font-size: 32px; margin-bottom: 20px; font-weight: 700; }
        
        /* Feature Boxes (Contact Info) */
        .features-showcase { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-bottom: 40px; }
        .feature-box { background: white; padding: 35px; border-radius: 16px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: all 0.3s; }
        .feature-box:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2); }
        .feature-icon { font-size: 40px; color: #667eea; margin-bottom: 15px; }
        .feature-box h3 { color: #2d3748; font-size: 20px; margin-bottom: 10px; font-weight: 700; }
        .feature-box p { color: #718096; font-size: 16px; }

        /* Form Styles */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label { display: block; margin-bottom: 8px; color: #4a5568; font-weight: 600; font-size: 14px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; transition: all 0.3s; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        
        .cta-button { padding: 15px 40px; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; justify-content: center; align-items: center; gap: 10px; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }

        /* Footer */
        .simple-footer { background: white; padding: 30px; text-align: center; margin-top: 60px; border-top: 1px solid #e2e8f0; }
        .simple-footer p { color: #718096; font-size: 16px; margin: 0; }

        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="page-container">
        <header className="page-header">
          <div className="logo-section">
            <div className="logo-icon"><IoMedical /></div>
            <span className="logo-text">MedMitra</span>
          </div>
          <button className="back-btn" onClick={() => navigate('/home')}>
            <IoArrowBack /> Back to Home
          </button>
        </header>

        <section className="hero-section">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">We are here to help and listen to your feedback.</p>
        </section>

        <div className="page-content">
          <div className="features-showcase">
            <div className="feature-box">
              <div className="feature-icon"><IoMail /></div>
              <h3>Email Us</h3>
              <p>support@medmitra.in</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon"><IoCall /></div>
              <h3>Call Us</h3>
              <p>+91 98765 43210</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon"><IoLocation /></div>
              <h3>Visit Us</h3>
              <p>AITR, Indore, Madhya Pradesh</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Send us a Message</h2>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group full-width">
                <label>Subject</label>
                <input type="text" placeholder="How can we help?" required />
              </div>
              <div className="form-group full-width">
                <label>Message</label>
                <textarea rows="5" placeholder="Type your message here..." required></textarea>
              </div>
              <div className="form-group full-width">
                <button type="submit" className="cta-button">
                  <IoSend /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer className="simple-footer">
          <p>© 2025 MedMitra. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Contact;