import { useState } from "react";
import axios from "axios";
import "./Signup.css";
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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    // 1. Check for MANDATORY Fields (Removed Phone2 and Emergency Contacts)
    if (
      !name || !email || !password || !age || !gender || !address || 
      !phone1 || !blood || !disease || !medicine || !vaccine || 
      !state || !city
    ) {
      return "All fields marked with * are mandatory.";
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address.";

    // 3. Strong Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be 8+ chars, with Uppercase, Lowercase, Number & Symbol.";
    }

    // 4. Age Validation
    if (isNaN(age) || age < 0 || age > 120) return "Please enter a valid age.";

    // 5. Phone Number Validation (Mandatory Phone 1)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone1)) return "Phone 1 must be a valid 10-digit number.";

    // 6. Optional Phone Validations (Only check if user typed something)
    if (phone2 && !phoneRegex.test(phone2)) return "Phone 2 must be a valid 10-digit number.";
    if (phonemem1 && !phoneRegex.test(phonemem1)) return "Emergency Contact 1 Phone must be 10 digits.";
    if (phonemem2 && !phoneRegex.test(phonemem2)) return "Emergency Contact 2 Phone must be 10 digits.";

    return null; // No errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Run Validations
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo(0, 0);
      return;
    }

    // Send Data
    axios
      .post("http://localhost:3001/register", {
        name, email, password, age, gender, address,
        phone1, phone2, blood, disease, medicine, vaccine,
        member1, phonemem1, member2, phonemem2, state, city,
      })
      .then((result) => {
        console.log(result);
        alert("Registration Successful!");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
        window.scrollTo(0, 0);
      });
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-card-container">
          <Link to="/" className="back-link">← Back to Home</Link>

          <div className="signup-header">
            <div className="logo-section-signup">
              <div className="logo-icon-signup"><span>M</span></div>
              <span className="logo-text-signup">Medmitra</span>
            </div>
            <h1 className="signup-title">Create Your Account</h1>
            <p className="signup-subtitle">All fields marked with * are mandatory</p>
          </div>

          {/* Error Message Box */}
          {error && <div className="signup-error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-sections">
              
              {/* --- Basic Information --- */}
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>

                <div className="input-group">
                  <label>Full Name <span style={{color: 'red'}}>*</span></label>
                  <input type="text" placeholder="Enter full name" className="signup-input" onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label>Email Address <span style={{color: 'red'}}>*</span></label>
                  <input type="email" placeholder="Enter valid email" className="signup-input" onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label>Password <span style={{color: 'red'}}>*</span></label>
                  <input type="password" placeholder="Strong Password" className="signup-input" onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Age <span style={{color: 'red'}}>*</span></label>
                    <input type="number" placeholder="Age" className="signup-input" onChange={(e) => setAge(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>Gender <span style={{color: 'red'}}>*</span></label>
                    <select className="signup-input" onChange={(e) => setGender(e.target.value)} required>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Address <span style={{color: 'red'}}>*</span></label>
                  <input type="text" placeholder="Full Address" className="signup-input" onChange={(e) => setAddress(e.target.value)} required />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>City <span style={{color: 'red'}}>*</span></label>
                    <input type="text" placeholder="City" className="signup-input" onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>State <span style={{color: 'red'}}>*</span></label>
                    <input type="text" placeholder="State" className="signup-input" onChange={(e) => setState(e.target.value)} required />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Phone 1 (10 digits) <span style={{color: 'red'}}>*</span></label>
                    <input type="tel" placeholder="9876543210" className="signup-input" onChange={(e) => setPhone1(e.target.value)} required maxLength="10" />
                  </div>
                  <div className="input-group">
                    <label>Phone 2 (Optional)</label>
                    <input type="tel" placeholder="Alternate Number" className="signup-input" onChange={(e) => setPhone2(e.target.value)} maxLength="10" />
                  </div>
                </div>
              </div>

              {/* --- Medical Details --- */}
              <div className="form-section">
                <h3 className="section-title">Medical Information</h3>

                <div className="input-group">
                  <label>Blood Group <span style={{color: 'red'}}>*</span></label>
                  <select className="signup-input" onChange={(e) => setBlood(e.target.value)} required>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Existing Diseases <span style={{color: 'red'}}>*</span></label>
                  <input type="text" placeholder="Type 'None' if healthy" className="signup-input" onChange={(e) => setDisease(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label>Regular Medicines <span style={{color: 'red'}}>*</span></label>
                  <input type="text" placeholder="Type 'None' if not taking any" className="signup-input" onChange={(e) => setMedicine(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label>Vaccination History <span style={{color: 'red'}}>*</span></label>
                  <input type="text" placeholder="Type 'None' if unknown" className="signup-input" onChange={(e) => setVaccine(e.target.value)} required />
                </div>
              </div>

              {/* --- Emergency Contacts (OPTIONAL) --- */}
              <div className="form-section">
                <h3 className="section-title">Emergency Contacts (Optional)</h3>

                <div className="input-group">
                  <label>Family Member 1 Name</label>
                  <input type="text" placeholder="Name" className="signup-input" onChange={(e) => setMember1(e.target.value)} />
                </div>

                <div className="input-group">
                  <label>Member 1 Phone</label>
                  <input type="tel" placeholder="Phone Number" className="signup-input" onChange={(e) => SetPhoneMem1(e.target.value)} maxLength="10" />
                </div>

                <div className="input-group">
                  <label>Family Member 2 Name</label>
                  <input type="text" placeholder="Name" className="signup-input" onChange={(e) => setMember2(e.target.value)} />
                </div>

                <div className="input-group">
                  <label>Member 2 Phone</label>
                  <input type="tel" placeholder="Phone Number" className="signup-input" onChange={(e) => SetPhoneMem2(e.target.value)} maxLength="10" />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-signup-submit">Create Account</button>

            <div className="signup-footer">
              <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;