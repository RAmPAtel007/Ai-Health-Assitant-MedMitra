// index.js (Backend - Node + Express)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const cron = require("node-cron");

const app = express();
const bcrypt = require("bcryptjs");
app.use(express.json());
app.use(cors());

// -----------------------------------------
// MongoDB Connection
// -----------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));


// -----------------------------------------
// Register User (UPDATED: Strong Password + Hashing)
// -----------------------------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, ...otherData } = req.body;

    // 1. Check if user already exists
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. STRONG PASSWORD VALIDATION (Stops creation if weak)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character." 
      });
    }

    // 3. HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. SAVE USER WITH HASHED PASSWORD
    const newUser = await EmployeeModel.create({
      name,
      email,
      password: hashedPassword, // Saving the hash
      ...otherData
    });

    res.status(201).json(newUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------
// Login
// -----------------------------------------

// -----------------------------------------
// Login (UPDATED: Hash Comparison)
// -----------------------------------------
// -----------------------------------------
// Login (CORRECTED)
// -----------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.json({ status: "No record existed" });
    }

    // FIX: Pass the PLAIN 'password' directly. 
    // bcrypt will extract the salt from 'user.password' automatically.
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.json({ status: "Success", user: user });
    } else {
      return res.json({ status: "Incorrect password" });
    }
  } catch (err) {
    res.json({ status: "Error", error: err.message });
  }
});

// -----------------------------------------
// Get user by email
// -----------------------------------------
app.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await EmployeeModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// Update User
// -----------------------------------------
app.put("/update/:email", async (req, res) => {
  try {
    const updatedUser = await EmployeeModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    res.json({
      status: "Success",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ status: "Error", error });
  }
});

// ------------------------------------------------
// Vaccination Recommended Schedule
// ------------------------------------------------
const recommendedSchedule = [
  { name: "BCG", agesMonths: [0] },
  { name: "HepB", agesMonths: [0, 1, 6] },
  { name: "OPV", agesMonths: [0, 6, 14] },
  { name: "DPT", agesMonths: [2, 4, 6, 18, 60] },
  { name: "Measles", agesMonths: [9, 15] },
];

function approxDobFromAge(ageString) {
  const n = parseInt(ageString, 10);
  if (!isNaN(n) && n > 0) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - n);
    return d;
  }
  return null;
}

function buildSchedule(user) {
  const now = new Date();
  let dob = user.dob ? new Date(user.dob) : null;

  if (!dob && user.age) dob = approxDobFromAge(user.age);

  const history = Array.isArray(user.vaccinations) ? user.vaccinations : [];

  const schedule = recommendedSchedule.map((vac) => {
    const taken = history
      .filter((h) => h.vaccineName === vac.name)
      .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken));

    const dosesTaken = taken.length;
    const nextDoseIndex = dosesTaken;
    const completed = nextDoseIndex >= vac.agesMonths.length;

    let nextDueDate = null;
    let status = "unknown";

    if (completed) {
      status = "completed";
    } else if (dob) {
      const months = vac.agesMonths[nextDoseIndex];
      const due = new Date(dob);
      due.setMonth(due.getMonth() + months);
      nextDueDate = due;

      if (due <= now) status = "due";
      else {
        const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        status = days <= 30 ? "upcoming" : "scheduled";
      }
    } else {
      status = "unknown - no dob/age";
    }

    return {
      vaccineName: vac.name,
      dosesRecommended: vac.agesMonths.length,
      dosesTaken,
      nextDoseIndex,
      nextDueDate,
      status,
    };
  });

  return schedule;
}

// -----------------------------------------
// GET Vaccination Schedule
// -----------------------------------------
app.get("/vaccination/schedule/:email", async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.email }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const schedule = buildSchedule(user);
    res.json({ user, schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------
// POST vaccination record
// -----------------------------------------
app.post("/user/:email/vaccination", async (req, res) => {
  let { vaccineName, nextDoseDate, doseNumber, totalDoses } = req.body;

  // Force date to YYYY-MM-DD format
  nextDoseDate = new Date(nextDoseDate).toISOString().split("T")[0];

  try {
    const user = await EmployeeModel.findOne({ email: req.params.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.vaccinations.push({
      vaccineName,
      nextDoseDate,
      doseNumber,
      totalDoses,
      completed: false,
    });

    await user.save();

    res.json({ status: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// CRON JOB — Runs Every Minute
// (Currently only logs reminders)
// -----------------------------------------
cron.schedule("* * * * *", async () => {
  console.log("Running daily vaccination checks...");

  const users = await EmployeeModel.find();
  const today = new Date().toISOString().split("T")[0];

  users.forEach((user) => {
    (user.vaccinations || []).forEach((vac) => {
      if (!vac.completed && vac.nextDoseDate === today) {
        console.log(`Reminder: ${user.email} is due for ${vac.vaccineName}`);
      }
    });
  });
});

// -----------------------------------------
// GET Today's Notifications
// -----------------------------------------
app.get("/notifications/:email", async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const today = new Date().toISOString().split("T")[0];

    const notifications = (user.vaccinations || [])
      .filter(v => !v.completed && v.nextDoseDate === today)
      .map(v => ({
        message: `Today is your vaccination date for ${v.vaccineName}`,
        vaccineName: v.vaccineName,
        date: today,
      }));

    res.json({ notifications });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const axios = require("axios");

// Helper: geocode city -> { lat, lon, display_name }
async function geocodeCity(city) {
  const url = `https://nominatim.openstreetmap.org/search`;
  const params = {
    q: city + ', India',
    format: "json",
    addressdetails: 1,
    limit: 1,
  };
  const r = await axios.get(url, { params, headers: { 'User-Agent': 'Medmitra/1.0' } });
  if (!r.data || r.data.length === 0) return null;
  const p = r.data[0];
  return { lat: parseFloat(p.lat), lon: parseFloat(p.lon), display_name: p.display_name };
}

// Endpoint: /hospitals?city=Indore&radius=5000
app.get("/hospitals", async (req, res) => {
  try {
    const city = req.query.city;
    const radius = parseInt(req.query.radius || "5000", 10); // meters
    if (!city) return res.status(400).json({ error: "city query param required" });

    // 1) Geocode
    const place = await geocodeCity(city);
    if (!place) return res.status(404).json({ error: "City not found" });

    const lat = place.lat;
    const lon = place.lon;

    // 2) Build Overpass QL
    // Search nodes/ways/relations with amenity=hospital within radius
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        relation["amenity"="hospital"](around:${radius},${lat},${lon});
      );
      out center tags;
    `;

    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const overpassResp = await axios.post(overpassUrl, overpassQuery, {
      headers: { "Content-Type": "text/plain", 'User-Agent': 'Medmitra/1.0' },
    });

    const elements = (overpassResp.data && overpassResp.data.elements) || [];

    // Normalize results
    const hospitals = elements.map((el) => {
      // For ways/relations use el.center else use el.lat/lon
      const latRes = el.lat || (el.center && el.center.lat) || null;
      const lonRes = el.lon || (el.center && el.center.lon) || null;
      return {
        id: el.id,
        type: el.type,
        name: (el.tags && (el.tags.name || el.tags["official_name"])) || "Unknown Hospital",
        lat: latRes,
        lon: lonRes,
        tags: el.tags || {},
        address: {
          street: el.tags && (el.tags["addr:street"] || ""),
          housenumber: el.tags && el.tags["addr:housenumber"],
          city: el.tags && (el.tags["addr:city"] || place.display_name),
          postcode: el.tags && el.tags["addr:postcode"],
        },
        phone: el.tags && (el.tags.phone || el.tags["contact:phone"] || el.tags["telephone"] || null),
      };
    }).filter(h => h.lat && h.lon);

    res.json({
      city: place.display_name,
      center: { lat, lon },
      count: hospitals.length,
      hospitals,
    });
  } catch (err) {
    console.error("Hospitals lookup error:", err.message || err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});


// -----------------------------------------
// Start Server
// -----------------------------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
