import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoMedical, IoPeople, IoSchool } from 'react-icons/io5';

const About = () => {
  const navigate = useNavigate();

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
        .content-section p { color: #4a5568; font-size: 18px; line-height: 1.8; margin-bottom: 15px; }

        /* Features/Team */
        .features-showcase { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; margin-top: 30px; }
        .feature-box { background: white; padding: 35px; border-radius: 16px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: all 0.3s; border: 1px solid #e2e8f0; }
        .feature-box:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2); border-color: #667eea; }
        .feature-box h3 { color: #2d3748; font-size: 20px; margin: 15px 0 5px 0; font-weight: 700; }
        .feature-box p { color: #718096; font-size: 14px; }

        /* List & CTA */
        .benefits-list { list-style: none; padding: 0; }
        .benefits-list li { color: #4a5568; font-size: 18px; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
        .cta-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px; border-radius: 16px; text-align: center; color: white; margin-top: 40px; }
        .cta-button { padding: 15px 40px; background: white; color: #667eea; border: none; border-radius: 10px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
        
        /* Footer */
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
            <IoArrowBack /> Back to Home
          </button>
        </header>

        <section className="hero-section">
          <h1>About MedMitra</h1>
          <p className="hero-subtitle">Bridging the gap in rural healthcare through AI and Voice.</p>
        </section>

        <div className="page-content">
          <div className="content-section">
            <h2>Our Mission</h2>
            <p>
              Healthcare accessibility remains one of the most critical challenges in India, particularly in rural and semi-urban areas. 
              Despite advances in medical technology, millions lack access to verified information.
            </p>
            <p>
              <strong>MedMitra</strong> is designed to democratize healthcare information. We strive to make medical guidance accessible, 
              understandable, and actionable for every Indian, regardless of their language, literacy level, or location.
            </p>
          </div>

          <div className="content-section">
            <h2><IoPeople style={{ marginRight: '10px' }} />Meet the Team</h2>
            <p>
              This project was developed by students of <strong>Acropolis Institute of Technology & Research, Indore</strong> as part of our Bachelor of Technology in Computer Science and Engineering.
            </p>
            <div className="features-showcase">
              <div className="feature-box">
                <IoSchool size={40} color="#667eea" />
                <h3>Ram Patel</h3>
                <p>Developer</p>
              </div>
              <div className="feature-box">
                <IoSchool size={40} color="#667eea" />
                <h3>Riya Ludhiyani</h3>
                <p>Developer</p>
              </div>
              <div className="feature-box">
                <IoSchool size={40} color="#667eea" />
                <h3>Rohan Vishwakarma</h3>
                <p>Developer</p>
              </div>
              <div className="feature-box">
                <IoSchool size={40} color="#667eea" />
                <h3>Samarth Pal</h3>
                <p>Developer</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="simple-footer">
          <p>© 2025 MedMitra. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default About;
