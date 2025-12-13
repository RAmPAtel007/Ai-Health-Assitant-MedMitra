// Home.js - COMPLETE IMPROVED VERSION
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaBell,
  FaSyringe,
  FaExclamationTriangle,
  FaHospital,
  FaPhoneAlt,
  FaLightbulb,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showHealthTips, setShowHealthTips] = useState(false);
  const [showHospitalFinder, setShowHospitalFinder] = useState(false);
  const [showVaccinationSchedule, setShowVaccinationSchedule] = useState(false);
  const [showOutbreakAlerts, setShowOutbreakAlerts] = useState(false);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [searchingHospitals, setSearchingHospitals] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [healthTipsSearch, setHealthTipsSearch] = useState("");
  const [outbreakData, setOutbreakData] = useState([]);
  const [loadingOutbreaks, setLoadingOutbreaks] = useState(false);

  const navigate = useNavigate();

  const [vaccineData, setVaccineData] = useState({
    vaccineName: "",
    doseNumber: 1,
    totalDoses: 1,
    nextDoseDate: "",
  });

  // Comprehensive health tips database
  const allHealthTips = [
    {
      category: "Hydration",
      tip: "Drink at least 8 glasses of water daily to maintain proper hydration and support bodily functions.",
      icon: "💧",
    },
    {
      category: "Sleep",
      tip: "Sleep 7–8 hours every night to allow your body to repair and rejuvenate.",
      icon: "😴",
    },
    {
      category: "Exercise",
      tip: "Exercise at least 30 minutes a day to improve cardiovascular health and boost mood.",
      icon: "🏃",
    },
    {
      category: "Nutrition",
      tip: "Avoid junk food and eat more fruits and vegetables for essential vitamins and minerals.",
      icon: "🥗",
    },
    {
      category: "Mental Health",
      tip: "Practice breathing exercises or meditation to reduce stress and improve mental clarity.",
      icon: "🧘",
    },
    {
      category: "Hygiene",
      tip: "Wash your hands frequently with soap for at least 20 seconds to prevent infections.",
      icon: "🧼",
    },
    {
      category: "Screen Time",
      tip: "Limit screen time and follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.",
      icon: "👁️",
    },
    {
      category: "Movement",
      tip: "Take a short walk every hour if sitting for long periods to prevent blood clots and stiffness.",
      icon: "🚶",
    },
    {
      category: "Nutrition",
      tip: "Include protein-rich foods like eggs, fish, legumes, and nuts in your daily diet.",
      icon: "🥚",
    },
    {
      category: "Mental Health",
      tip: "Practice gratitude daily by writing down three things you're thankful for.",
      icon: "📝",
    },
    {
      category: "Exercise",
      tip: "Include strength training exercises at least twice a week to maintain muscle mass.",
      icon: "💪",
    },
    {
      category: "Sleep",
      tip: "Maintain a consistent sleep schedule by going to bed and waking up at the same time daily.",
      icon: "⏰",
    },
    {
      category: "Hydration",
      tip: "Start your day with a glass of water to kickstart your metabolism.",
      icon: "☀️",
    },
    {
      category: "Nutrition",
      tip: "Reduce sugar intake and opt for natural sweeteners like honey or dates.",
      icon: "🍯",
    },
    {
      category: "Hygiene",
      tip: "Brush your teeth twice daily and floss to maintain oral health.",
      icon: "🦷",
    },
    {
      category: "Mental Health",
      tip: "Connect with friends and family regularly to maintain social bonds and emotional health.",
      icon: "👨‍👩‍👧",
    },
    {
      category: "Exercise",
      tip: "Try yoga or stretching exercises to improve flexibility and reduce tension.",
      icon: "🧘‍♀️",
    },
    {
      category: "Nutrition",
      tip: "Eat fiber-rich foods like whole grains, oats, and vegetables for better digestion.",
      icon: "🌾",
    },
    {
      category: "Prevention",
      tip: "Get regular health check-ups and screenings to catch potential issues early.",
      icon: "🏥",
    },
    {
      category: "Immunity",
      tip: "Include vitamin C-rich foods like citrus fruits, bell peppers, and broccoli in your diet.",
      icon: "🍊",
    },
    {
      category: "Heart Health",
      tip: "Reduce salt intake to lower blood pressure and improve heart health.",
      icon: "❤️",
    },
    {
      category: "Bone Health",
      tip: "Get adequate vitamin D through sunlight exposure or supplements for strong bones.",
      icon: "☀️",
    },
    {
      category: "Digestion",
      tip: "Eat probiotic-rich foods like yogurt and fermented foods for gut health.",
      icon: "🥛",
    },
    {
      category: "Weight Management",
      tip: "Practice portion control and eat mindfully without distractions.",
      icon: "🍽️",
    },
    {
      category: "Skin Care",
      tip: "Use sunscreen with at least SPF 30 daily to protect your skin from UV damage.",
      icon: "🧴",
    },
    {
      category: "Prevention",
      tip: "Keep up to date with your vaccination schedule to prevent infectious diseases.",
      icon: "💉",
    },
    {
      category: "Mental Health",
      tip: "Limit caffeine intake, especially in the evening, for better sleep quality.",
      icon: "☕",
    },
    {
      category: "Exercise",
      tip: "Take the stairs instead of the elevator to increase daily physical activity.",
      icon: "🪜",
    },
    {
      category: "Hygiene",
      tip: "Change your bedsheets weekly to prevent skin issues and allergies.",
      icon: "🛏️",
    },
    {
      category: "Nutrition",
      tip: "Stay away from processed foods and cook fresh meals whenever possible.",
      icon: "🍳",
    },
  ];

  const filteredHealthTips = healthTipsSearch
    ? allHealthTips.filter(
        (item) =>
          item.tip.toLowerCase().includes(healthTipsSearch.toLowerCase()) ||
          item.category.toLowerCase().includes(healthTipsSearch.toLowerCase())
      )
    : allHealthTips;

  // Fetch User
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3001/user/${userEmail}`)
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  // Load Notifications
  const loadNotifications = () => {
    if (!user?.email) return;
    axios
      .get(`http://localhost:3001/notifications/${user.email}`)
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 20000);
    return () => clearInterval(timer);
  }, [user?.email]);

  // Load Vaccination Schedule
  const loadVaccinationSchedule = () => {
    if (!user?.email) return;
    axios
      .get(
        `http://localhost:3001/vaccination/schedule/${encodeURIComponent(
          user.email
        )}`
      )
      .then((res) => setSchedule(res.data.schedule || []))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (showVaccinationSchedule) {
      loadVaccinationSchedule();
    }
  }, [showVaccinationSchedule, user?.email]);

  // Fetch outbreak data - Replace with real API call
  const fetchOutbreakData = async () => {
    if (!user?.city) return;
    setLoadingOutbreaks(true);

    // Simulated data - replace with real API
    setTimeout(() => {
      setOutbreakData([
        {
          disease: "Dengue",
          cases: 45,
          severity: "High",
          lastUpdated: "2 days ago",
          color: "#ef4444",
        },
        {
          disease: "Malaria",
          cases: 12,
          severity: "Medium",
          lastUpdated: "1 week ago",
          color: "#f59e0b",
        },
        {
          disease: "Typhoid",
          cases: 8,
          severity: "Low",
          lastUpdated: "3 days ago",
          color: "#10b981",
        },
        {
          disease: "Chikungunya",
          cases: 23,
          severity: "Medium",
          lastUpdated: "5 days ago",
          color: "#f59e0b",
        },
      ]);
      setLoadingOutbreaks(false);
    }, 1000);
  };

  // Profile Toggle
  const handleProfileToggle = () => setShowProfile(!showProfile);
  const handleEditClick = () => setEditMode(true);

  // Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Profile
  const handleSave = () => {
    axios
      .put(`http://localhost:3001/update/${user.email}`, formData)
      .then((res) => {
        alert("Profile Updated Successfully!");
        setUser(res.data.user);
        setEditMode(false);
      })
      .catch((err) => console.log(err));
  };

  // Save Vaccine
  const saveVaccine = () => {
    axios
      .post(`http://localhost:3001/user/${user.email}/vaccination`, vaccineData)
      .then((res) => {
        alert("Vaccination added successfully!");
        setShowVaccinationForm(false);
        setVaccineData({
          vaccineName: "",
          doseNumber: 1,
          totalDoses: 1,
          nextDoseDate: "",
        });
        loadVaccinationSchedule();
        loadNotifications();
      })
      .catch((err) => console.log(err));
  };

  // Find Hospitals
  const findNearbyHospitals = () => {
    if (!user?.city) {
      alert("City information not available in your profile");
      return;
    }
    setSearchingHospitals(true);
    axios
      .get(`http://localhost:3001/hospitals?city=${user.city}&radius=5000`)
      .then((res) => {
        setHospitals(res.data.hospitals || []);
        setSearchingHospitals(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Error finding hospitals");
        setSearchingHospitals(false);
      });
  };

  // Emergency Help - FIXED
  const handleEmergency = () => {
    // Check if emergency contact fields exist in formData (from edit) or user object
    const member1 = formData.member1 || user?.member1;
    const phonemem1 = formData.phonemem1 || user?.phonemem1;

    if (!member1 || !phonemem1) {
      alert(
        "Please add emergency contacts in your profile first.\n\nGo to Edit Profile and add:\n- Emergency Contact 1 Name\n- Emergency Contact 1 Phone"
      );
      setEditMode(true);
      return;
    }

    const message = `EMERGENCY ALERT: ${user.name} needs immediate help! Please contact them at ${user.phone1}. Location: ${user.address}, ${user.city}, ${user.state}`;

    const member2 = formData.member2 || user?.member2;
    const phonemem2 = formData.phonemem2 || user?.phonemem2;

    alert(
      `🚨 EMERGENCY NOTIFICATION SENT 🚨\n\nNotified:\n✓ ${member1}: ${phonemem1}${
        member2 ? "\n✓ " + member2 + ": " + phonemem2 : ""
      }\n\nMessage: "${message}"\n\n✅ In a real scenario, SMS/Call would be triggered immediately.`
    );

    console.log("Emergency contacts notified:", message);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  // Load VAPI Widgets - MOVED OUTSIDE COMPONENT
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      {/* Header - Matching Landing Page Style */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon-home">M</div>
            <span className="logo-text-home">Medmitra</span>
          </div>
        </div>

        <div className="header-center">
          <h1 className="welcome-text">Welcome back, {user.name}! 👋</h1>
        </div>

        <div className="header-right">
          <div
            className="notification-icon-wrapper"
            onClick={() => setShowVaccinationSchedule(true)}
          >
            <FaBell className="header-icon" />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>

          <div className="profile-icon-wrapper" onClick={handleProfileToggle}>
            <FaUserCircle className="header-icon profile-icon-header" />
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <FaUserCircle size={50} className="profile-avatar" />
            <div>
              <h3>{user.name}</h3>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
          <div className="profile-dropdown-body">
            <div className="profile-info-row">
              <span className="info-label">Age:</span>
              <span className="info-value">{user.age}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Gender:</span>
              <span className="info-value">{user.gender}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Blood Group:</span>
              <span className="info-value">{user.blood || "N/A"}</span>
            </div>
            <div className="profile-info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">
                {user.city}, {user.state}
              </span>
            </div>
          </div>
          <div className="profile-dropdown-footer">
            <button className="btn-edit-profile" onClick={handleEditClick}>
              Edit Profile
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Quick Stats */}
        <section className="quick-stats">
          <div className="stat-card stat-card-1">
            <FaSyringe className="stat-icon" />
            <div>
              <h3>{user.vaccinations?.length || 0}</h3>
              <p>Vaccinations</p>
            </div>
          </div>
          <div className="stat-card stat-card-2">
            <FaBell className="stat-icon" />
            <div>
              <h3>{notifications.length}</h3>
              <p>Notifications</p>
            </div>
          </div>
          <div className="stat-card stat-card-3">
            <FaCalendarAlt className="stat-icon" />
            <div>
              <h3>{schedule.filter((s) => s.status === "due").length}</h3>
              <p>Pending</p>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="features-grid">
          <div
            className="feature-card-home card-purple"
            onClick={() => setShowVaccinationForm(true)}
          >
            <div className="feature-icon-wrapper">
              <FaSyringe className="feature-icon-large" />
            </div>
            <h3>Vaccination Schedule</h3>
            <p>Track and get reminders for your vaccines</p>
          </div>

          <div
            className="feature-card-home card-blue"
            onClick={() => setShowHealthTips(true)}
          >
            <div className="feature-icon-wrapper">
              <FaLightbulb className="feature-icon-large" />
            </div>
            <h3>Health Tips</h3>
            <p>Daily health and wellness advice</p>
          </div>

          <div
            className="feature-card-home card-green"
            onClick={() => {
              setShowOutbreakAlerts(true);
              fetchOutbreakData();
            }}
          >
            <div className="feature-icon-wrapper">
              <FaExclamationTriangle className="feature-icon-large" />
            </div>
            <h3>Outbreak Alerts</h3>
            <p>Stay aware of disease outbreaks near you</p>
          </div>

          <div
            className="feature-card-home card-orange"
            onClick={() => {
              setShowHospitalFinder(true);
              findNearbyHospitals();
            }}
          >
            <div className="feature-icon-wrapper">
              <FaHospital className="feature-icon-large" />
            </div>
            <h3>Hospital Finder</h3>
            <p>Find nearby hospitals instantly</p>
          </div>

          <div className="feature-card-home card-red" onClick={handleEmergency}>
            <div className="feature-icon-wrapper">
              <FaPhoneAlt className="feature-icon-large" />
            </div>
            <h3>Emergency Help</h3>
            <p>Notify your family in emergencies</p>
          </div>

          <div
            className="feature-card-home card-teal"
            onClick={() => setShowVaccinationSchedule(true)}
          >
            <div className="feature-icon-wrapper">
              <FaCalendarAlt className="feature-icon-large" />
            </div>
            <h3>My Schedule</h3>
            <p>View your vaccination schedule</p>
          </div>
        </section>
      </main>

      {/* Footer - NEW */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon-footer">M</div>
              <span className="logo-text-footer">Medmitra</span>
            </div>
            <p className="footer-desc">
              Your personal AI health assistant for daily wellness support and
              vaccination tracking.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 support@medmitra.com</p>
            <p>📞 +91 1234567890</p>
            <p>📍 Indore, Madhya Pradesh</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Medmitra. All rights reserved.</p>
        </div>
      </footer>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="modal-overlay" onClick={() => setEditMode(false)}>
          <div
            className="modal-content modal-edit-profile"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setEditMode(false)}
              />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  name="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <input
                  name="blood"
                  value={formData.blood || ""}
                  onChange={handleChange}
                  placeholder="e.g., O+, A-, B+"
                />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone 1</label>
                <input
                  name="phone1"
                  value={formData.phone1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone 2</label>
                <input
                  name="phone2"
                  value={formData.phone2 || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Emergency Contacts Section */}
              <div className="form-group full-width">
                <h4 style={{ margin: "20px 0 10px 0", color: "#ef4444" }}>
                  🚨 Emergency Contacts
                </h4>
              </div>
              <div className="form-group">
                <label>Emergency Contact 1 Name</label>
                <input
                  name="member1"
                  value={formData.member1 || ""}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact 1 Phone</label>
                <input
                  name="phonemem1"
                  value={formData.phonemem1 || ""}
                  onChange={handleChange}
                  placeholder="e.g., 9876543210"
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact 2 Name (Optional)</label>
                <input
                  name="member2"
                  value={formData.member2 || ""}
                  onChange={handleChange}
                  placeholder="e.g., Jane Doe"
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact 2 Phone (Optional)</label>
                <input
                  name="phonemem2"
                  value={formData.phonemem2 || ""}
                  onChange={handleChange}
                  placeholder="e.g., 9876543211"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn-cancel" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vaccination Form Modal */}
      {showVaccinationForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowVaccinationForm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule New Vaccination</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setShowVaccinationForm(false)}
              />
            </div>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Vaccine Name</label>
                <input
                  type="text"
                  placeholder="e.g., BCG, DPT, MMR, COVID-19"
                  value={vaccineData.vaccineName}
                  onChange={(e) =>
                    setVaccineData({
                      ...vaccineData,
                      vaccineName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Dose Number</label>
                <input
                  type="number"
                  min="1"
                  value={vaccineData.doseNumber}
                  onChange={(e) =>
                    setVaccineData({
                      ...vaccineData,
                      doseNumber: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Total Doses</label>
                <input
                  type="number"
                  min="1"
                  value={vaccineData.totalDoses}
                  onChange={(e) =>
                    setVaccineData({
                      ...vaccineData,
                      totalDoses: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-group full-width">
                <label>Next Dose Date</label>
                <input
                  type="date"
                  value={vaccineData.nextDoseDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setVaccineData({
                      ...vaccineData,
                      nextDoseDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={saveVaccine}>
                Save Vaccination
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowVaccinationForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Tips Modal - ENHANCED */}
      {showHealthTips && (
        <div className="modal-overlay" onClick={() => setShowHealthTips(false)}>
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>💡 Health Tips Library</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setShowHealthTips(false)}
              />
            </div>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search health tips by category or keyword..."
                value={healthTipsSearch}
                onChange={(e) => setHealthTipsSearch(e.target.value)}
                className="search-input"
              />
              {healthTipsSearch && (
                <FaTimes
                  className="clear-search"
                  onClick={() => setHealthTipsSearch("")}
                />
              )}
            </div>

            <div className="tips-count">
              Showing {filteredHealthTips.length} of {allHealthTips.length}{" "}
              health tips
            </div>

            <div className="tips-grid-enhanced">
              {filteredHealthTips.map((item, index) => (
                <div key={index} className="tip-card-enhanced">
                  <div className="tip-icon">{item.icon}</div>
                  <div className="tip-content">
                    <span className="tip-category">{item.category}</span>
                    <p className="tip-text">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredHealthTips.length === 0 && (
              <div className="no-results">
                <p>No health tips found matching "{healthTipsSearch}"</p>
                <button
                  onClick={() => setHealthTipsSearch("")}
                  className="btn-clear-search"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hospital Finder Modal */}
      {showHospitalFinder && (
        <div
          className="modal-overlay"
          onClick={() => setShowHospitalFinder(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>🏥 Nearby Hospitals - {user.city}</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setShowHospitalFinder(false)}
              />
            </div>

            {searchingHospitals ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching for hospitals...</p>
              </div>
            ) : (
              <div className="hospitals-list">
                {hospitals.length === 0 ? (
                  <div className="no-results">
                    <p>No hospitals found nearby</p>
                  </div>
                ) : (
                  hospitals.map((hospital, idx) => (
                    <div key={idx} className="hospital-card">
                      <div className="hospital-header">
                        <FaHospital className="hospital-icon" />
                        <h4>{hospital.name}</h4>
                      </div>

                      <p className="hospital-address">
                        📍 {hospital?.address?.street || ""}{" "}
                        {hospital?.address?.housenumber || ""},{" "}
                        {hospital?.address?.city || user.city}
                      </p>

                      {hospital.phone && (
                        <p className="hospital-phone">📞 {hospital.phone}</p>
                      )}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-directions"
                      >
                        Get Directions →
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Outbreak Alerts Modal - NEW FUNCTIONAL */}
      {showOutbreakAlerts && (
        <div
          className="modal-overlay"
          onClick={() => setShowOutbreakAlerts(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>⚠️ Disease Outbreak Alerts - {user.city}</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setShowOutbreakAlerts(false)}
              />
            </div>

            {loadingOutbreaks ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading outbreak data...</p>
              </div>
            ) : (
              <>
                <div className="outbreak-info">
                  <p>
                    Real-time disease outbreak information for your area. Stay
                    informed and take necessary precautions.
                  </p>
                </div>

                <div className="outbreak-grid">
                  {outbreakData.map((outbreak, idx) => (
                    <div
                      key={idx}
                      className="outbreak-card"
                      style={{ borderLeft: `4px solid ${outbreak.color}` }}
                    >
                      <div className="outbreak-header">
                        <h3>{outbreak.disease}</h3>
                        <span
                          className={`severity-badge severity-${outbreak.severity.toLowerCase()}`}
                        >
                          {outbreak.severity} Risk
                        </span>
                      </div>
                      <div className="outbreak-details">
                        <div className="outbreak-stat">
                          <span className="stat-label">Reported Cases:</span>
                          <span className="stat-value">{outbreak.cases}</span>
                        </div>
                        <div className="outbreak-stat">
                          <span className="stat-label">Last Updated:</span>
                          <span className="stat-value">
                            {outbreak.lastUpdated}
                          </span>
                        </div>
                      </div>
                      <div className="outbreak-prevention">
                        <h5>Prevention Tips:</h5>
                        <ul>
                          {outbreak.disease === "Dengue" && (
                            <>
                              <li>Use mosquito repellent</li>
                              <li>Wear long-sleeved clothes</li>
                              <li>Remove standing water</li>
                            </>
                          )}
                          {outbreak.disease === "Malaria" && (
                            <>
                              <li>Sleep under mosquito nets</li>
                              <li>Use insect repellent</li>
                              <li>Keep surroundings clean</li>
                            </>
                          )}
                          {outbreak.disease === "Typhoid" && (
                            <>
                              <li>Drink boiled or purified water</li>
                              <li>Wash hands frequently</li>
                              <li>Avoid street food</li>
                            </>
                          )}
                          {outbreak.disease === "Chikungunya" && (
                            <>
                              <li>Eliminate mosquito breeding sites</li>
                              <li>Use mosquito repellent</li>
                              <li>Wear protective clothing</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Vaccination Schedule Modal - ENHANCED */}
      {showVaccinationSchedule && (
        <div
          className="modal-overlay"
          onClick={() => setShowVaccinationSchedule(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>📅 Your Vaccination Schedule</h2>
              <FaTimes
                className="modal-close"
                onClick={() => setShowVaccinationSchedule(false)}
              />
            </div>

            {notifications.length > 0 && (
              <div className="notifications-section">
                <h3>🔔 Today's Notifications</h3>
                {notifications.map((n, idx) => (
                  <div key={idx} className="notification-item-modal">
                    <FaBell className="notif-icon" />
                    <span>{n.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* User's Added Vaccinations */}
            {user.vaccinations && user.vaccinations.length > 0 && (
              <>
                <h3
                  style={{
                    marginTop: "30px",
                    marginBottom: "15px",
                    color: "#2d3748",
                  }}
                >
                  Your Scheduled Vaccinations
                </h3>
                <div className="schedule-grid">
                  {user.vaccinations.map((vac, idx) => (
                    <div
                      key={idx}
                      className={`schedule-card ${
                        vac.completed ? "status-completed" : "status-scheduled"
                      }`}
                    >
                      <h4>{vac.vaccineName}</h4>
                      <div className="schedule-details">
                        <p>
                          <strong>Dose:</strong> {vac.doseNumber} of{" "}
                          {vac.totalDoses}
                        </p>
                        <p>
                          <strong>Next Date:</strong>{" "}
                          {new Date(vac.nextDoseDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong>
                          <span
                            className={`status-badge ${
                              vac.completed ? "completed" : "scheduled"
                            }`}
                          >
                            {vac.completed ? "Completed" : "Scheduled"}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Recommended Schedule */}
            <h3
              style={{
                marginTop: "30px",
                marginBottom: "15px",
                color: "#2d3748",
              }}
            >
              Recommended Vaccination Schedule
            </h3>
            <div className="schedule-grid">
              {schedule.length === 0 ? (
                <p className="no-data">
                  No vaccination schedule available. Please update your age/DOB
                  in profile.
                </p>
              ) : (
                schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`schedule-card status-${item.status}`}
                  >
                    <h4>{item.vaccineName}</h4>
                    <div className="schedule-details">
                      <p>
                        <strong>Status:</strong>
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                      </p>
                      <p>
                        <strong>Doses:</strong> {item.dosesTaken} /{" "}
                        {item.dosesRecommended}
                      </p>
                      {item.nextDueDate && (
                        <p>
                          <strong>Next Due:</strong>{" "}
                          {new Date(item.nextDueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VAPI Widgets - ALWAYS VISIBLE */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
        <vapi-widget 
          public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"
          assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"
          mode="chat" 
          theme="dark" 
          position="bottom-right" 
          title="Chat with Medmitra"
          style="z-index: 9999;">
        </vapi-widget>

        <vapi-widget 
          public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"
          assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"
          mode="voice" 
          theme="dark" 
          position="bottom-left" 
          title="Talk with Medmitra"
          style="z-index: 9999;">
        </vapi-widget>
      `,
        }}
      />
    </div>
  );
}
export default Home;
