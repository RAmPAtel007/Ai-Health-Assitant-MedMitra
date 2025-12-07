import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "./Home.css";
import NotificationCorner from "./components/NotificationCorner";

function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});

  const [vaccineData, setVaccineData] = useState({
    vaccineName: "",
    doseNumber: 1,
    totalDoses: 1,
    nextDoseDate: "",
  });

  const [showHealthTips, setShowHealthTips] = useState(false);

const healthTips = [
  "Drink at least 8 glasses of water daily.",
  "Sleep 7–8 hours every night.",
  "Exercise at least 30 minutes a day.",
  "Avoid junk food and eat more fruits.",
  "Do breathing exercises to reduce stress.",
  "Wash your hands frequently to avoid infections.",
  "Limit screen time to reduce eye strain.",
  "Take a short walk every 1 hour if sitting long.",
];


  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    axios
      .get(`http://localhost:3001/user/${userEmail}`)
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // ---------------- PROFILE TOGGLE ----------------
  const handleProfileToggle = () => setShowProfile(!showProfile);
  const handleEditClick = () => setEditMode(true);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- SAVE EDIT PROFILE ----------------
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

  // ---------------- SAVE VACCINE ----------------
  const saveVaccine = () => {
    axios
      .post(`http://localhost:3001/user/${user.email}/vaccination`, vaccineData)
      .then((res) => {
        alert("Vaccination added successfully!");
        setShowVaccinationForm(false);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  // ---------------- LOAD CHAT/VOICE WIDGETS ----------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <h2>Welcome to Medmitra</h2>

        {/* PROFILE ICON */}
        <div className="profile-container">
          <FaUserCircle
            className="profile-icon"
            size={50}
            onClick={handleProfileToggle}
          />

          {showProfile && user && (
            <div className="profile-card">
              <h3>{user.name}</h3>

              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>State:</strong> {user.state}</p>
              <p><strong>Phone 1:</strong> {user.phone1}</p>
              <p><strong>Phone 2:</strong> {user.phone2}</p>

              <button className="edit-btn" onClick={handleEditClick}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* NOTIFICATION BOX */}
      <NotificationCorner userEmail={user?.email} />

      {/* ================= EDIT PROFILE POPUP ================= */}
      {editMode && (
        <div className="edit-popup">
          <div className="edit-box">
            <h3>Edit Profile</h3>

            <input name="name" value={formData.name} onChange={handleChange} />
            <input name="age" value={formData.age} onChange={handleChange} />
            <input name="gender" value={formData.gender} onChange={handleChange} />
            <input name="address" value={formData.address} onChange={handleChange} />
            <input name="city" value={formData.city} onChange={handleChange} />
            <input name="state" value={formData.state} onChange={handleChange} />
            <input name="phone1" value={formData.phone1} onChange={handleChange} />
            <input name="phone2" value={formData.phone2} onChange={handleChange} />

            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ================= FEATURE CARDS ================= */}
      <div className="dashboard-wrapper">

        <div
          className="feature-card"
          onClick={() => setShowVaccinationForm(true)}
        >
          <h3 className="feature-title">Vaccination Schedule</h3>
          <p className="feature-desc">Track and get reminders for your vaccines.</p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Outbreak Alerts</h3>
          <p className="feature-desc">Stay aware of disease outbreaks near you.</p>
        </div>

        {/* ROW 2 */}
        <div className="feature-row-2">
          <div className="feature-card">
            <h3 className="feature-title">Hospital Finder</h3>
            <p className="feature-desc">Find nearby hospitals instantly.</p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">Emergency Help</h3>
            <p className="feature-desc">Notify your family in emergencies.</p>
          </div>

<div className="feature-card" onClick={() => setShowHealthTips(true)}>
  <h3 className="feature-title">Health Tips</h3>
  <p className="feature-desc">Daily health and wellness advice.</p>
</div>
        </div>
      </div>

      {/* ================= SHOW VACCINATION FORM WHEN CLICKED ================= */}
      {showVaccinationForm && (
        <div className="vaccine-form">
          <h3>Schedule a new vaccination</h3>

          <input type="text" placeholder="Vaccine Name (e.g., BCG)"
            onChange={(e) => setVaccineData({ ...vaccineData, vaccineName: e.target.value })} />

          <input type="number" placeholder="Dose Number"
            onChange={(e) => setVaccineData({ ...vaccineData, doseNumber: e.target.value })} />

          <input type="number" placeholder="Total Doses"
            onChange={(e) => setVaccineData({ ...vaccineData, totalDoses: e.target.value })} />

          <input type="date"
            onChange={(e) => setVaccineData({ ...vaccineData, nextDoseDate: e.target.value })} />

          <button onClick={saveVaccine}>Save Vaccination</button>
        </div>
      )}

      {showHealthTips && (
  <div className="tips-popup">
    <div className="tips-box">
      <h3 className="tips-title">💡 Daily Health Tips</h3>

      <ul>
        {healthTips.map((tip, index) => (
          <li key={index} className="tip-item">{tip}</li>
        ))}
      </ul>

      <button className="close-tips" onClick={() => setShowHealthTips(false)}>Close</button>
    </div>
  </div>
)}


      {/* VAPI WIDGETS */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <vapi-widget public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"
              assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"
              mode="chat" theme="dark" position="bottom-right" title="Chat with Medmitra"></vapi-widget>

            <vapi-widget public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"
              assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"
              mode="voice" theme="dark" position="bottom-left" title="Talk with Medmitra"></vapi-widget>
          `,
        }}
      />
    </div>
  );
}

export default Home;