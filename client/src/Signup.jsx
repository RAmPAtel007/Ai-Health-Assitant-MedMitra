import { useState } from "react";
import axios from "axios";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [address, setAddress] = useState();
  const [phone1, setPhone1] = useState();
  const [phone2, setPhone2] = useState();
  const [blood, setBlood] = useState();
  const [disease, setDisease] = useState();
  const [medicine, setMedicine] = useState();
  const [vaccine, setVaccine] = useState();
  const [member1, setMember1] = useState();
  const [phonemem1, SetPhoneMem1] = useState();
  const [member2, setMember2] = useState();
  const [phonemem2, SetPhoneMem2] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const navigate = useNavigate()

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
  }
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url('/image3.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="p-4 rounded shadow w-100"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
          color: "white",
        }}
      >
        <h1 className="text-center mb-4 text-primary">Register Yourself</h1>
        <form onSubmit={handleSubmit}>
          <div className="signup-container">
            <div className="signup-section">
              <h5 className="text-primary mb-3">Basic Details</h5>

              <div className="mb-3">
                <label htmlFor="email">
                  <strong>Name</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  autoComplete="off"
                  name="email"
                  className="form-control rounded-0"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">
                  <strong>Email</strong>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  autoComplete="off"
                  name="email"
                  className="form-control rounded-0"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  autoComplete="off"
                  name="password"
                  className="form-control rounded-0"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Age</strong>
                </label>
                <input
                  type="number"
                  placeholder="Enter Age"
                  autoComplete="off"
                  name="age"
                  className="form-control rounded-0"
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Gender</strong>
                </label>
                <select
                  name="gender"
                  className="form-control rounded-0"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label>
                  <strong>Address</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  autoComplete="off"
                  name="address"
                  className="form-control rounded-0"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter City"
                  autoComplete="off"
                  name="city"
                  className="form-control rounded-0 mt-2"
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter State"
                  autoComplete="off"
                  name="state"
                  className="form-control rounded-0 mt-2"
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Phone Number 1</strong>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number 1"
                  autoComplete="off"
                  name="phone1"
                  className="form-control rounded-0"
                  onChange={(e) => setPhone1(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>
                  <strong>Phone Number 2</strong>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number 2"
                  autoComplete="off"
                  name="phone2"
                  className="form-control rounded-0"
                  onChange={(e) => setPhone2(e.target.value)}
                />
              </div>
            </div>
            <div className="right-column">
              <div className="signup-section">
                <h5 className="text-primary mb-3">Medical Details</h5>

                <div className="mb-3">
                  <label>
                    <strong>Blood Group</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Blood Group"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => setBlood(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>
                    <strong>Diseases (if any)</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Diseases"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => setDisease(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>
                    <strong>Name of Regular Medicines</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Medicines"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => setMedicine(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>
                    <strong>Vaccination History</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Vaccines Taken"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => setVaccine(e.target.value)}
                  />
                </div>
              </div>
              <div className="signup-section mt-4">
                <h5 className="text-primary mb-3">Family Details</h5>

                <div className="mb-3">
                  <label>
                    <strong>Family Member 1 Name</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Family Member Name"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => setMember1(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>
                    <strong>Member 1 Phone Number</strong>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => SetPhoneMem1(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>
                    <strong>Family Member 2 Name</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Family Member Name"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => setMember2(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>
                    <strong>Member 2 Phone Number</strong>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    autoComplete="off"
                    className="form-control rounded-0"
                    onChange={(e) => SetPhoneMem2(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Register
          </button>
        </form>
        <p>Already have an Account</p>
        <Link
          to="/login"
          className="btn btn-outline-light border w-100 rounded-0 text-decoration-none"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
