/* eslint-disable no-unused-vars */
// Home.js - FIXED: Pending Count (Immediate Load) + Hospital Map URL

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import VapiWidget from "./components/Vapi/VapiWidget"; 
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
  FaStar,
  FaTimes,
  FaRobot,
  FaMagic,
  FaPlusCircle,
  FaGoogle,
  FaTrash, 
  FaMapMarkerAlt, 
  FaDirections
} from "react-icons/fa";
import "./Home.css";

// Helper for Hospital Distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function Home() {
  // STATE MANAGEMENT
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  // Modals
  const [showHealthTips, setShowHealthTips] = useState(false);
  const [showHospitalFinder, setShowHospitalFinder] = useState(false);
  const [showVaccinationSchedule, setShowVaccinationSchedule] = useState(false);
  const [showOutbreakAlerts, setShowOutbreakAlerts] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); 

  // Data
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  // Hospital Data
  const [hospitals, setHospitals] = useState([]);
  const [searchingHospitals, setSearchingHospitals] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  

  const [schedule, setSchedule] = useState([]);
  const [outbreakData, setOutbreakData] = useState([]);
  const [loadingOutbreaks, setLoadingOutbreaks] = useState(false);
  
  // AI Tip state
  const [aiTip, setAiTip] = useState(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // New Vaccine Form State
  const [newVaccine, setNewVaccine] = useState({
    vaccineName: "",
    doseNumber: "1",
    totalDoses: "3",
    nextDoseDate: ""
  });

  const navigate = useNavigate();

  // Helper: Get Today's Date for Validation
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // ------------------------------------------------------------
  // 1. GOOGLE CALENDAR HELPER
  // ------------------------------------------------------------
  const addToCalendar = (vaccineName, dateStr) => {
    if (!dateStr) return alert("No date available for this vaccine.");
    
    const date = new Date(dateStr);
    const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";
    const end = start; 

    const title = encodeURIComponent(`Vaccination Due: ${vaccineName}`);
    const details = encodeURIComponent("Reminder from Medmitra App: Please visit your nearest hospital.");
    const location = encodeURIComponent("Local Hospital");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, "_blank");
  };

  // ------------------------------------------------------------
  // 2. HANDLE ADD NEW VACCINE
  // ------------------------------------------------------------
  const handleAddVaccine = (e) => {
    e.preventDefault();
    
    // Check Empty
    if(!newVaccine.vaccineName || !newVaccine.nextDoseDate) {
        alert("Please fill in Vaccine Name and Date.");
        return;
    }

    // Check Past Date
    const today = getTodayDate();
    if (newVaccine.nextDoseDate < today) {
        alert("You cannot schedule a vaccination in the past. Please select a future date.");
        return;
    }

    axios.post(`http://localhost:3001/user/${user.email}/vaccination`, newVaccine)
      .then(res => {
        alert("Vaccine scheduled successfully!");
        setUser(res.data.user); 
        setNewVaccine({ vaccineName: "", doseNumber: "1", totalDoses: "3", nextDoseDate: "" }); 
        
        // Refresh Data
        loadNotifications(res.data.user); 
        loadVaccinationSchedule(); // Update schedule immediately
      })
      .catch(err => console.error(err));
  };

  // ------------------------------------------------------------
  // 3. HANDLE DELETE VACCINE
  // ------------------------------------------------------------
  const handleDeleteVaccine = (vaccineId) => {
    if(!window.confirm("Are you sure you want to delete this schedule?")) return;

    axios.delete(`http://localhost:3001/user/${user.email}/vaccination/${vaccineId}`)
      .then(res => {
        alert("Vaccination record deleted.");
        setUser(prevUser => ({
            ...prevUser,
            vaccinations: prevUser.vaccinations.filter(v => v._id !== vaccineId)
        }));
        loadVaccinationSchedule(); // Recalculate pending
        setTimeout(() => loadNotifications(), 500); 
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete record.");
      });
  };

  // ------------------------------------------------------------
  // 4. HEALTH TIPS
  // ------------------------------------------------------------
  const allHealthTips = [
    { category: "Hydration", tip: "Drink at least 8 glasses of water daily.", icon: "💧" },
    { category: "Sleep", tip: "Sleep 7–8 hours every night for repair.", icon: "😴" },
    { category: "Exercise", tip: "30 minutes of cardio improves heart health.", icon: "🏃" },
    { category: "Nutrition", tip: "Eat a rainbow of vegetables for vitamins.", icon: "🥗" },
    { category: "Mental Health", tip: "5 minutes of meditation reduces cortisol.", icon: "🧘" },
    { category: "Hygiene", tip: "Wash hands for 20 seconds to kill germs.", icon: "🧼" },
    { category: "Eyes", tip: "Follow the 20-20-20 rule for screen time.", icon: "👁️" },
    { category: "Movement", tip: "Stand up and stretch every hour.", icon: "🚶" },
    { category: "Protein", tip: "Include eggs or lentils in your breakfast.", icon: "🥚" },
    { category: "Gratitude", tip: "Write down 3 things you are grateful for.", icon: "📝" },
  ];

  const generateAiTip = () => {
    setLoadingTip(true);
    setAiTip(null); 
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allHealthTips.length);
      const rawTip = allHealthTips[randomIndex];
      const intros = [
        `Hello ${user?.name || "Friend"}, based on general wellness data, here is your focus:`,
        "Analyzing your health profile... Here is a recommendation:",
        "Medmitra AI suggests focusing on this today:",
        "For optimal vitality, try incorporating this:",
      ];
      const randomIntro = intros[Math.floor(Math.random() * intros.length)];
      setAiTip({ intro: randomIntro, ...rawTip });
      setLoadingTip(false);
    }, 1500);
  };

  // ------------------------------------------------------------
  // 5. INITIAL DATA LOADING
  // ------------------------------------------------------------
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }
    axios.get(`http://localhost:3001/user/${userEmail}`)
      .then((res) => { setUser(res.data); setFormData(res.data); })
      .catch((err) => console.log(err));
  }, [navigate]);

  // LOAD NOTIFICATIONS
  const loadNotifications = (currentUser = user) => {
    if (!currentUser?.email) return;
    
    axios.get(`http://localhost:3001/notifications/${currentUser.email}`)
      .then((res) => { 
        const backendAlerts = (res.data.notifications || []).filter(n => n.type === 'emergency');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const vaccineAlerts = (currentUser.vaccinations || [])
          .filter(v => !v.completed)
          .map(v => {
             const doseDate = new Date(v.nextDoseDate);
             doseDate.setHours(0,0,0,0);
             const diffTime = doseDate - today;
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             return { ...v, diffDays };
          })
          .filter(v => v.diffDays >= 0 && v.diffDays <= 7) 
          .map(v => ({
             message: v.diffDays === 0 
               ? `Today is your vaccination: ${v.vaccineName}` 
               : `Upcoming: ${v.vaccineName} in ${v.diffDays} days`,
             type: "vaccine",
             date: v.nextDoseDate
          }));

        const finalNotifications = [...backendAlerts, ...vaccineAlerts];
        finalNotifications.sort((a, b) => new Date(a.date) - new Date(b.date));

        setNotifications(finalNotifications);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if(user) {
      loadNotifications(user);
    }
    const timer = setInterval(() => { if(user) loadNotifications(user); }, 20000);
    return () => clearInterval(timer);
  }, [user]);

  // --- FIX: LOAD SCHEDULE IMMEDIATELY (So Pending Count is correct on refresh) ---
  const loadVaccinationSchedule = () => {
    if (!user?.email) return;
    axios.get(`http://localhost:3001/vaccination/schedule/${encodeURIComponent(user.email)}`)
      .then((res) => setSchedule(res.data.schedule || []))
      .catch((err) => console.log(err));
  };

  // Run this whenever user data is available (not just when modal opens)
  useEffect(() => {
    if (user?.email) {
      loadVaccinationSchedule();
    }
  }, []);

  // ------------------------------------------------------------
  // 6. OUTBREAKS
  // ------------------------------------------------------------
  const fetchOutbreakData = async () => {
    const userCity = user?.city; 
    if (!userCity) {
      alert("Please update your profile with your City to see local alerts.");
      return;
    }
    setLoadingOutbreaks(true);
    axios.get(`http://localhost:3001/outbreaks?city=${userCity}`)
      .then((res) => { setOutbreakData(res.data.alerts || []); setLoadingOutbreaks(false); })
      .catch((err) => { console.error("Error fetching outbreaks:", err); setLoadingOutbreaks(false); });
  };

  // ------------------------------------------------------------
  // 7. HOSPITAL FINDER (Fixed Map URL)
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // 7. HOSPITAL FINDER (UPDATED: High Rated Logic)
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // 7. HOSPITAL FINDER (UPDATED: High Rated Logic)
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // 7. HOSPITAL FINDER (INSTANT MAP + CITY LIST)
  // ------------------------------------------------------------
  const findNearbyHospitals = () => {
    if (!user?.city) {
      alert("Please update your profile with your City first.");
      setEditMode(true);
      return;
    }

    setSearchingHospitals(true);
    setHospitals([]); 
    setShowHospitalFinder(true); 

    // 1. INSTANTLY SHOW MAP (Uses Google Maps Embed with City Name)
    // This works 100% of the time, even if the API fails.
    setMapUrl(`https://maps.google.com/maps?q=hospitals+in+${user.city}&t=&z=13&ie=UTF8&iwloc=&output=embed`);

    // 2. FETCH LIST FROM BACKEND (Background process)
    axios.get(`http://localhost:3001/hospitals?city=${user.city}`)
      .then((res) => {
        setHospitals(res.data.hospitals || []);
        setSearchingHospitals(false);
      })
      .catch((err) => {
        console.warn("List fetch error, but map is visible.");
        setSearchingHospitals(false);
      });
  };

  // OPEN GOOGLE MAPS ON CLICK
  const openInMaps = (hospital) => {
    // Opens standard Google Maps in a new tab
    const url = `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lon}`;
    window.open(url, '_blank');
  };

  // 2. Click a Hospital -> Show Directions on Map
const viewOnMap = (hospital) => {
  if (userLocation) {
      // Directions Mode with both markers: Your location + Hospital
      const embedUrl = `https://maps.google.com/maps?saddr=${userLocation.lat},${userLocation.lon}&daddr=${hospital.lat},${hospital.lon}&output=embed`;
      setMapUrl(embedUrl);
  } else {
      // Fallback: Just pin the hospital
      const pinUrl = `https://maps.google.com/maps?q=${hospital.lat},${hospital.lon}&z=15&output=embed`;
      setMapUrl(pinUrl);
  }
};

  // 3. Reset Map to My Location
  const recenterMap = () => {
    if (userLocation) {
        const resetUrl = `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lon}&z=14&output=embed`;
        setMapUrl(resetUrl);
    }
  };

  // ------------------------------------------------------------
  // 8. EMERGENCY ALERT
  // ------------------------------------------------------------
  const handleEmergency = () => {
    if (!user || !user.email) return;
    if(!window.confirm("⚠️ Are you sure you want to send an Emergency Alert to your contacts?")) return;

    axios.post(`http://localhost:3001/emergency/${user.email}`)
      .then((res) => {
        if (res.data.status === "NoContacts") {
           alert("❌ No emergency contacts found.\n\nPlease go to 'Edit Profile' and add Member 1 & Member 2 phone numbers.");
           setEditMode(true); 
        } 
        else if (res.data.status === "Success") {
           const count = res.data.matchedUsers;
           alert(`✅ ALERTS SENT SUCCESSFULLY!\n\n${count} of your contacts are registered on Medmitra and have received the red notification.`);
        } else {
           alert(`⚠️ ALERT LOGGED.\n\nContacts notified via SMS fallback.`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error sending alert. Please use your phone dialer to call 100.");
      });
  };

  // Profile Handlers
  const handleProfileToggle = () => setShowProfile(!showProfile);
  const handleEditClick = () => setEditMode(true);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSave = () => {
    axios.put(`http://localhost:3001/update/${user.email}`, formData)
      .then((res) => { alert("Profile Updated Successfully!"); setUser(res.data.user); setEditMode(false); })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => { localStorage.removeItem("userEmail"); navigate("/"); };

  if (!user) return (<div className="loading-container"><div className="loading-spinner"></div><p>Loading your dashboard...</p></div>);

  return (
    <div className="home-dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-section"><div className="logo-icon-home">M</div><span className="logo-text-home">Medmitra</span></div>
        </div>
        <div className="header-center"><h1 className="welcome-text">Welcome back, {user.name}! 👋</h1></div>
        <div className="header-right">
          <div className="notification-icon-wrapper" onClick={() => setShowNotificationModal(true)}>
            <FaBell className="header-icon" />
            {notifications.length > 0 && (<span className="notification-badge">{notifications.length}</span>)}
          </div>
          <div className="profile-icon-wrapper" onClick={handleProfileToggle}><FaUserCircle className="header-icon profile-icon-header" /></div>
        </div>
      </header>

      {/* PROFILE DROPDOWN */}
      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <FaUserCircle size={50} className="profile-avatar" />
            <div><h3>{user.name}</h3><p className="profile-email">{user.email}</p></div>
          </div>
          <div className="profile-dropdown-body">
            <div className="profile-info-row"><span className="info-label">Age:</span><span className="info-value">{user.age}</span></div>
            <div className="profile-info-row"><span className="info-label">Location:</span><span className="info-value">{user.city}, {user.state}</span></div>
          </div>
          <div className="profile-dropdown-footer">
            <button className="btn-edit-profile" onClick={handleEditClick}>Edit Profile</button>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* Quick Stats */}
        <section className="quick-stats">
          <div className="stat-card stat-card-1"><FaSyringe className="stat-icon" /><div><h3>{user.vaccinations?.length || 0}</h3><p>Vaccinations</p></div></div>
          <div className="stat-card stat-card-2"><FaBell className="stat-icon" /><div><h3>{notifications.length}</h3><p>Notifications</p></div></div>
          {/* FIX: Ensure schedule exists before filtering to avoid crashes */}
          <div className="stat-card stat-card-3"><FaCalendarAlt className="stat-icon" /><div><h3>{schedule ? schedule.filter((s) => s.status === "due" || s.status === "upcoming").length : 0}</h3><p>Pending</p></div></div>
        </section>

        {/* Feature Cards Grid */}
        <section className="features-grid">
          <div className="feature-card-home card-purple" onClick={() => setShowVaccinationSchedule(true)}>
            <div className="feature-icon-wrapper"><FaSyringe className="feature-icon-large" /></div>
            <h3>Vaccination Schedule</h3><p>Track and get reminders for your vaccines</p>
          </div>
          <div className="feature-card-home card-blue" onClick={() => { setShowHealthTips(true); generateAiTip(); }}>
            <div className="feature-icon-wrapper"><FaLightbulb className="feature-icon-large" /></div>
            <h3>Health Tips</h3><p>Daily health and wellness advice</p>
          </div>
          <div className="feature-card-home card-green" onClick={() => { setShowOutbreakAlerts(true); fetchOutbreakData(); }}>
            <div className="feature-icon-wrapper"><FaExclamationTriangle className="feature-icon-large" /></div>
            <h3>Outbreak Alerts</h3><p>Stay aware of disease outbreaks near you</p>
          </div>
          <div className="feature-card-home card-orange" onClick={() => { setShowHospitalFinder(true); findNearbyHospitals(); }}>
            <div className="feature-icon-wrapper"><FaHospital className="feature-icon-large" /></div>
            <h3>Hospital Finder</h3><p>Find nearby hospitals instantly</p>
          </div>
          <div className="feature-card-home card-red" onClick={handleEmergency}>
            <div className="feature-icon-wrapper"><FaPhoneAlt className="feature-icon-large" /></div>
            <h3>Emergency Help</h3><p>Notify your family in emergencies</p>
          </div>
          <div className="feature-card-home card-teal" onClick={() => setShowVaccinationSchedule(true)}>
            <div className="feature-icon-wrapper"><FaCalendarAlt className="feature-icon-large" /></div>
            <h3>My Schedule</h3><p>View your vaccination schedule</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo"><div className="logo-icon-footer">M</div><span className="logo-text-footer">Medmitra</span></div>
            <p className="footer-desc">Your personal AI health assistant for daily wellness support and vaccination tracking.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
           </div>
          <div className="footer-section"><h4>Contact</h4><p>📧 support@medmitra.com</p>
          <p>📞 +91 8523697415 </p>
          <p>📍 Indore, Madhya Pradesh</p></div>
        </div>
        <div className="footer-bottom"><p>© 2025 Medmitra. All rights reserved.</p></div>
      </footer>

      {/* EDIT PROFILE MODAL */}
      {editMode && (
        <div className="modal-overlay" onClick={() => setEditMode(false)}>
          <div className="modal-content modal-edit-profile" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Edit Profile</h2><FaTimes className="modal-close" onClick={() => setEditMode(false)} /></div>
            <div className="form-grid">
              <div className="form-group"><label>Name</label><input name="name" value={formData.name || ""} onChange={handleChange} /></div>
              <div className="form-group"><label>Age</label><input name="age" type="number" value={formData.age || ""} onChange={handleChange} /></div>
              <div className="form-group"><label>City</label><input name="city" value={formData.city || ""} onChange={handleChange} /></div>
              <div className="form-group"><label>Phone 1</label><input name="phone1" value={formData.phone1 || ""} onChange={handleChange} /></div>
              <div className="form-group full-width"><h4 style={{ margin: "20px 0 10px 0", color: "#ef4444" }}>🚨 Emergency Contacts</h4></div>
              <div className="form-group"><label>Contact 1 Phone</label><input name="phonemem1" value={formData.phonemem1 || ""} onChange={handleChange} /></div>
              <div className="form-group"><label>Contact 2 Phone</label><input name="phonemem2" value={formData.phonemem2 || ""} onChange={handleChange} /></div>
            </div>
            <div className="modal-actions"><button className="btn-save" onClick={handleSave}>Save Changes</button><button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* VACCINATION SCHEDULE MODAL */}
      {showVaccinationSchedule && (
        <div className="modal-overlay" onClick={() => setShowVaccinationSchedule(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 Your Vaccination Schedule</h2>
              <FaTimes className="modal-close" onClick={() => setShowVaccinationSchedule(false)} />
            </div>
            
            {/* ADD VACCINE FORM */}
            <div className="vaccine-form-container" style={{backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0'}}>
                <h4 style={{margin: '0 0 15px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px'}}><FaPlusCircle color="#2563eb"/> Add New Schedule / Record</h4>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <input 
                        type="text" placeholder="Vaccine Name (e.g. Polio)" 
                        className="form-input" style={{flex: 1}}
                        value={newVaccine.vaccineName}
                        onChange={(e) => setNewVaccine({...newVaccine, vaccineName: e.target.value})}
                    />
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <label style={{fontSize: '0.9rem', color: '#64748b'}}>Dose:</label>
                        <select className="form-input" value={newVaccine.doseNumber} onChange={(e) => setNewVaccine({...newVaccine, doseNumber: e.target.value})}>
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span style={{color: '#64748b'}}>/</span>
                        <select className="form-input" value={newVaccine.totalDoses} onChange={(e) => setNewVaccine({...newVaccine, totalDoses: e.target.value})}>
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    
                    {/* DATE INPUT WITH VALIDATION */}
                    <input 
                        type="date" 
                        className="form-input"
                        min={getTodayDate()} 
                        value={newVaccine.nextDoseDate}
                        onChange={(e) => setNewVaccine({...newVaccine, nextDoseDate: e.target.value})}
                    />
                    
                    <button className="btn-save" style={{padding: '10px 20px'}} onClick={handleAddVaccine}>Add</button>
                </div>
            </div>

            {/* USER SCHEDULE LIST */}
            {user.vaccinations && user.vaccinations.length > 0 && (
              <>
                <h3 style={{ marginTop: "10px", marginBottom: "15px", color: "#2d3748" }}>Your Scheduled Vaccinations</h3>
                <div className="schedule-grid">
                  {user.vaccinations.map((vac, idx) => (
                    <div key={idx} className={`schedule-card ${vac.completed ? "status-completed" : "status-scheduled"}`}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <h4>{vac.vaccineName}</h4>
                        <div style={{display:'flex', gap:'8px'}}>
                            {!vac.completed && (
                                <button onClick={() => addToCalendar(vac.vaccineName, vac.nextDoseDate)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb'}} title="Add to Google Calendar"><FaGoogle size={16} /></button>
                            )}
                            <button onClick={() => handleDeleteVaccine(vac._id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'}} title="Delete Schedule"><FaTrash size={16} /></button>
                        </div>
                      </div>
                      <div className="schedule-details">
                        <p><strong>Dose:</strong> {vac.doseNumber} of {vac.totalDoses}</p>
                        <p><strong>Next Date:</strong> {new Date(vac.nextDoseDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span className={`status-badge ${vac.completed ? "completed" : "scheduled"}`}>{vac.completed ? "Completed" : "Scheduled"}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* RECOMMENDED LIST */}
            <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "#2d3748" }}>Recommended Vaccination Schedule</h3>
            <div className="schedule-grid">
              {schedule.length === 0 ? (
                <p className="no-data">No vaccination schedule available. Please update your age/DOB in profile.</p>
              ) : (
                schedule.map((item, idx) => (
                  <div key={idx} className={`schedule-card status-${item.status}`}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <h4>{item.vaccineName}</h4>
                        {item.nextDueDate && (
                            <button onClick={() => addToCalendar(item.vaccineName, item.nextDueDate)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb'}} title="Add to Google Calendar"><FaGoogle size={18} /></button>
                        )}
                    </div>
                    <div className="schedule-details">
                      <p><strong>Status:</strong> <span className={`status-badge ${item.status}`}>{item.status}</span></p>
                      <p><strong>Doses:</strong> {item.dosesTaken} / {item.dosesRecommended}</p>
                      {item.nextDueDate && (<p><strong>Next Due:</strong> {new Date(item.nextDueDate).toLocaleDateString()}</p>)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* HOSPITAL FINDER MODAL */}
      {/* HOSPITAL FINDER MODAL */}
      {/* HOSPITAL FINDER MODAL (CITY BASED) */}
      {showHospitalFinder && (
        <div className="modal-overlay" onClick={() => setShowHospitalFinder(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()} style={{ height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            
            {/* Header */}
            <div className="modal-header" style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <FaHospital style={{color: '#ef4444', fontSize: '1.2rem'}}/>
                <h2 style={{fontSize: '1.2rem', margin: 0}}>Hospitals in {user.city}</h2>
              </div>
              <FaTimes className="modal-close" style={{position:'static', cursor:'pointer'}} onClick={() => setShowHospitalFinder(false)} />
            </div>
            
            {/* MAP SECTION (Always Visible) */}
            <div style={{ flex: '5', background: '#e5e7eb', position: 'relative' }}>
                <iframe 
                    title="Map" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={mapUrl} 
                    allowFullScreen 
                    style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                ></iframe>
            </div>
            
            {/* LIST SECTION */}
            <div style={{ flex: '5', background: '#fff', overflowY: 'auto', padding: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Top Rated Nearby</span>
                {searchingHospitals && <span style={{fontSize: '0.8rem', color: '#2563eb'}}>Loading list...</span>}
              </h4>
              
              {hospitals.length === 0 && !searchingHospitals ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>
                    <p>Use the map above to browse hospitals.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {hospitals.map((h, idx) => (
                    <div key={idx} onClick={() => openInMaps(h)} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '8px', border: '1px solid #f3f4f6', background: idx === 0 ? '#f0f9ff' : '#fff', cursor: 'pointer', alignItems: 'center' }}>
                      <div style={{flex: 1}}>
                        <strong style={{ display: 'block', color: '#1f2937', fontSize: '1rem' }}>{h.name}</strong>
                        
                        {/* RATING STARS */}
                        <div style={{display:'flex', alignItems:'center', gap:'5px', marginTop:'4px'}}>
                            <span style={{background:'#fef3c7', color:'#d97706', padding:'2px 6px', borderRadius:'4px', fontSize:'0.8rem', fontWeight:'bold', display:'flex', alignItems:'center', gap:'3px'}}>
                                {h.rating} <FaStar size={10}/>
                            </span>
                            <span style={{fontSize:'0.8rem', color:'#6b7280'}}>Highly Rated</span>
                        </div>

                        <span style={{ display:'block', fontSize: '0.8rem', color: '#6b7280', marginTop:'5px' }}>{h.address}</span>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <button style={{background:'#2563eb', color:'white', border:'none', padding:'8px 12px', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}>
                            <FaDirections/> Go
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OUTBREAK ALERTS MODAL */}
      {showOutbreakAlerts && (
        <div className="modal-overlay" onClick={()=>setShowOutbreakAlerts(false)}>
            <div className="modal-content modal-large">
                <div className="modal-header"><h2>⚠️ Disease Outbreak Alerts - {user.city}</h2><FaTimes className="modal-close" onClick={()=>setShowOutbreakAlerts(false)}/></div>
                {loadingOutbreaks ? (<div className="loading-container"><div className="loading-spinner"></div><p>Loading data...</p></div>) : (
                    <div className="outbreak-grid">
                        {outbreakData.map((outbreak, idx) => (
                            <div key={idx} className="outbreak-card" style={{ borderLeft: `4px solid ${outbreak.color || '#ef4444'}` }}>
                                <div className="outbreak-header"><h3>{outbreak.disease}</h3><span className="severity-badge">{outbreak.severity} Risk</span></div>
                                <div className="outbreak-details">
                                    <p><strong>Cases:</strong> {outbreak.cases}</p>
                                    <p><strong>Updated:</strong> {outbreak.lastUpdated}</p>
                                </div>
                                <div className="outbreak-prevention" style={{marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
                                    <h5>Safety Tips:</h5>
                                    <ul style={{paddingLeft: '20px', margin: 0}}>
                                        {outbreak.tips && outbreak.tips.map((tip, tIdx) => <li key={tIdx} style={{fontSize: '0.9rem', color: '#555'}}>{tip}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}

      {/* HEALTH TIPS MODAL */}
      {showHealthTips && (
        <div className="modal-overlay" onClick={() => setShowHealthTips(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px', textAlign: 'center'}}>
            <div className="modal-header" style={{ justifyContent: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaRobot size={28} color="#2563eb" />
                <h2 style={{margin: 0}}>Medmitra AI Insight</h2>
              </div>
              <FaTimes className="modal-close" onClick={() => setShowHealthTips(false)} style={{position: 'absolute', right: 0}} />
            </div>

            <div style={{ padding: '20px 0', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {loadingTip ? (
                <>
                  <div className="loading-spinner" style={{width: '40px', height: '40px', borderColor: '#2563eb transparent #2563eb transparent'}}></div>
                  <p style={{marginTop: '15px', color: '#666', fontStyle: 'italic'}}>Analyzing health patterns...</p>
                </>
              ) : (
                aiTip && (
                  <div className="ai-result-card" style={{ animation: 'fadeIn 0.5s ease' }}>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>
                      {aiTip.intro}
                    </p>
                    
                    <div style={{ 
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
                      padding: '25px', 
                      borderRadius: '16px',
                      border: '1px solid #bfdbfe',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{aiTip.icon}</div>
                      <h3 style={{ color: '#1e40af', marginBottom: '10px', fontSize: '1.4rem' }}>{aiTip.category}</h3>
                      <p style={{ color: '#1e3a8a', fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '500' }}>
                        "{aiTip.tip}"
                      </p>
                    </div>

                    <button 
                      onClick={generateAiTip}
                      style={{
                        marginTop: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginInline: 'auto',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      <FaMagic /> Generate New Tip
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* NOTIFICATIONS MODAL */}
      {showNotificationModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header"><h2>🔔 Notifications</h2><FaTimes className="modal-close" onClick={() => setShowNotificationModal(false)} /></div>
            <div className="notifications-list-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? <p style={{textAlign:'center', padding:'20px', color:'#666'}}>No new notifications</p> : notifications.map((n, idx) => (
                  <div key={idx} style={{ padding: '15px', borderBottom: '1px solid #eee', borderLeft: n.type === 'emergency' ? '4px solid #ef4444' : '4px solid #4299e1', backgroundColor: n.type === 'emergency' ? '#fff5f5' : 'white', marginBottom: '10px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{n.type === 'vaccine' ? "💉 Vaccine Alert" : "🔔 Alert"}</p>
                    <p style={{ margin: '5px 0' }}>{n.message}</p>
                    <small style={{color:'#999'}}>{new Date(n.date).toLocaleDateString()}</small>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VAPI WIDGETS */}
      <VapiWidget />

    </div>
  );
}

export default Home;