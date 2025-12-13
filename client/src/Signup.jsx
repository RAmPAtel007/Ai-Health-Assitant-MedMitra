import { useState } from "react";
import axios from "axios";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [blood, setBlood] = useState("");
  const [disease, setDisease] = useState("");
  const [medicine, setMedicine] = useState("");
  const [vaccine, setVaccine] = useState("");
  const [member1, setMember1] = useState("");
  const [phonemem1, SetPhoneMem1] = useState("");
  const [member2, setMember2] = useState("");
  const [phonemem2, SetPhoneMem2] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", {
        name,
        email,
        password,
        age,
        gender,
        address,
        phone1,
        phone2,
        blood,
        disease,
        medicine,
        vaccine,
        member1,
        phonemem1,
        member2,
        phonemem2,
        state,
        city,
      })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-card-container">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>

          <div className="signup-header">
            <div className="logo-section-signup">
              <div className="logo-icon-signup">
                <span>M</span>
              </div>
              <span className="logo-text-signup">Medmitra</span>
            </div>
            <h1 className="signup-title">Create Your Account</h1>
            <p className="signup-subtitle">Join thousands improving their health</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-sections">
              {/* Basic Details */}
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>

                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="signup-input"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="signup-input"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="signup-input"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      className="signup-input"
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Gender</label>
                    <select
                      className="signup-input"
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="Street address"
                    className="signup-input"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="City"
                      className="signup-input"
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>State</label>
                    <input
                      type="text"
                      placeholder="State"
                      className="signup-input"
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Phone 1</label>
                    <input
                      type="tel"
                      placeholder="Primary phone"
                      className="signup-input"
                      onChange={(e) => setPhone1(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Phone 2</label>
                    <input
                      type="tel"
                      placeholder="Secondary phone"
                      className="signup-input"
                      onChange={(e) => setPhone2(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="form-section">
                <h3 className="section-title">Medical Information</h3>

                <div className="input-group">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    placeholder="e.g., O+, A-, AB+"
                    className="signup-input"
                    onChange={(e) => setBlood(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Existing Diseases (if any)</label>
                  <input
                    type="text"
                    placeholder="List any chronic conditions"
                    className="signup-input"
                    onChange={(e) => setDisease(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Regular Medicines</label>
                  <input
                    type="text"
                    placeholder="List medications you take regularly"
                    className="signup-input"
                    onChange={(e) => setMedicine(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Vaccination History</label>
                  <input
                    type="text"
                    placeholder="List vaccines you've received"
                    className="signup-input"
                    onChange={(e) => setVaccine(e.target.value)}
                  />
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="form-section">
                <h3 className="section-title">Emergency Contacts</h3>

                <div className="input-group">
                  <label>Family Member 1 Name</label>
                  <input
                    type="text"
                    placeholder="Emergency contact name"
                    className="signup-input"
                    onChange={(e) => setMember1(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Member 1 Phone</label>
                  <input
                    type="tel"
                    placeholder="Emergency contact phone"
                    className="signup-input"
                    onChange={(e) => SetPhoneMem1(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Family Member 2 Name</label>
                  <input
                    type="text"
                    placeholder="Second emergency contact"
                    className="signup-input"
                    onChange={(e) => setMember2(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Member 2 Phone</label>
                  <input
                    type="tel"
                    placeholder="Second contact phone"
                    className="signup-input"
                    onChange={(e) => SetPhoneMem2(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-signup-submit">
              Create Account
            </button>

            <div className="signup-footer">
              <p>Already have an account?</p>
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;