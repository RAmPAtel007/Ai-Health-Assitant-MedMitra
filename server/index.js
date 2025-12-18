// index.js - FINAL MERGED VERSION
// Integrates Friend's Auth + Your Advanced Tracking/Alert Features

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios"); // Required for Hospital API
const Parser = require('rss-parser'); // Required for Outbreaks
const parser = new Parser();
const bcrypt = require("bcryptjs"); // Security

const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());

// -----------------------------------------
// MongoDB Connection
// -----------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// -----------------------------------------
// 1. SECURE REGISTER (Friend's Logic + Hash)
// -----------------------------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, ...otherData } = req.body;

    // Check existing
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character." 
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save
    const newUser = await EmployeeModel.create({
      name,
      email,
      password: hashedPassword,
      ...otherData
    });

    res.status(201).json(newUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------
// 2. SECURE LOGIN
// -----------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.json({ status: "No record existed" });

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
// 3. USER PROFILE ROUTES
// -----------------------------------------
app.get("/user/:email", async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/update/:email", async (req, res) => {
  try {
    const updatedUser = await EmployeeModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    res.json({ status: "Success", user: updatedUser });
  } catch (error) {
    res.json({ status: "Error", error });
  }
});

// ------------------------------------------------
// 4. FEATURE: ROBUST DISEASE TRACKER (Your Logic)
// ------------------------------------------------
app.get("/outbreaks", async (req, res) => {
  const rawCity = req.query.city;
  if (!rawCity) return res.json({ alerts: [] });

  const city = rawCity.trim();
  let alerts = [];

  try {
    // A. GOOGLE NEWS RSS QUERY
    const query = `${city} (outbreak OR cases OR positive OR detected OR infected OR virus OR fever OR flu OR hospital) -movie -film -review -boxoffice -cricket -match -messi -kohli -election -vote -rally -police -crime -arrest when:14d`;
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const feed = await parser.parseURL(feedUrl);
    
    const seenDiseases = new Set();

    // B. DICTIONARY MATCHING
    const knownDiseases = [
      "Dengue", "Malaria", "Chikungunya", "Typhoid", "Cholera", "Jaundice",
      "Zika", "Nipah", "H1N1", "Swine Flu", "Bird Flu", "Scrub Typhus",
      "Leptospirosis", "Conjunctivitis", "Eye Flu", "Measles", "Chickenpox",
      "Covid", "Omicron", "Corona", "Anthrax", "Rabies", "Hepatitis",
      "Encephalitis", "Brain Fever", "Mumps", "Tuberculosis", "TB", "Pneumonia",
      "Tomato Flu", "Gastro", "Diarrhea", "Heatstroke", "Food Poisoning",
      "Norovirus", "Rotavirus", "Salmonella", "E. coli", "Lassa Fever", 
      "Marburg", "Ebola", "Chandipura", "Kysanur", "Monkeypox"
    ];

    feed.items.forEach(item => {
      const title = item.title;
      const lowerTitle = title.toLowerCase();

      // Junk Filter
      const banned = ["trailer", "teaser", "review", "collection", "messi", "kohli", "election", "vote", "rally", "minister", "scheme", "camping", "goat", "dhurandhar", "bigg boss"];
      if (banned.some(w => lowerTitle.includes(w))) return;

      let detectedName = null;

      // Check Dictionary
      for (let disease of knownDiseases) {
        if (new RegExp(`\\b${disease}\\b`, 'i').test(title)) {
          detectedName = disease;
          break;
        }
      }

      // Check Pattern (Fallback)
      if (!detectedName) {
        const regex = /\b([A-Z][a-zA-Z]+) (Virus|Fever|Flu|Infection|Disease|Strain|Variant)\b/;
        const match = title.match(regex);
        if (match && match[1]) {
           let potentialName = match[1].trim();
           const junk = ["The", "A", "New", "Total", "Active", "Severe", "Mystery", "Unknown", "Viral", "Seasonal", "Daily", "Reported"];
           if (!junk.includes(potentialName) && potentialName.length > 3) {
             detectedName = potentialName;
           }
        }
      }

      // Add Alert
      if (detectedName && !seenDiseases.has(detectedName)) {
        seenDiseases.add(detectedName);
        let severity = "Medium";
        let color = "#f59e0b"; // Orange
        if (lowerTitle.includes("death") || lowerTitle.includes("toll") || lowerTitle.includes("critical") || lowerTitle.includes("icu")) {
          severity = "High";
          color = "#ef4444"; // Red
        }

        alerts.push({
          disease: detectedName,
          severity: severity,
          color: color,
          cases: "In News",
          lastUpdated: new Date(item.pubDate).toLocaleDateString(),
          tips: [title]
        });
      }
    });

  } catch (err) {
    console.error("RSS Scan Error:", err.message);
  }

  // Fallback
  if (alerts.length === 0) {
    alerts.push({
      disease: "No Major Outbreaks",
      severity: "Safe",
      color: "#10b981",
      cases: "0",
      lastUpdated: new Date().toLocaleDateString(),
      tips: ["No infectious disease clusters reported in the news for this location."]
    });
  }

  res.json({ city: rawCity, alerts: alerts.slice(0, 5) });
});

// ------------------------------------------------
// 5. FEATURE: HOSPITALS (Your GPS + Overpass Logic)
// ------------------------------------------------

// Helper: Geocode City
async function geocodeCity(city) {
  const url = `https://nominatim.openstreetmap.org/search`;
  const params = { q: city + ', India', format: "json", addressdetails: 1, limit: 1 };
  const r = await axios.get(url, { params, headers: { 'User-Agent': 'Medmitra/1.0' } });
  if (!r.data || r.data.length === 0) return null;
  const p = r.data[0];
  return { lat: parseFloat(p.lat), lon: parseFloat(p.lon), display_name: p.display_name };
}

// Helper: Haversine Distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

app.get("/hospitals", async (req, res) => {
  try {
    let lat, lon, displayName;

    // A. Prioritize GPS
    if (req.query.lat && req.query.lon) {
      lat = parseFloat(req.query.lat);
      lon = parseFloat(req.query.lon);
      displayName = "Current Location";
    } 
    // B. Fallback to City
    else if (req.query.city) {
      const place = await geocodeCity(req.query.city);
      if (!place) return res.status(404).json({ error: "City not found" });
      lat = place.lat;
      lon = place.lon;
      displayName = place.display_name;
    } else {
      return res.status(400).json({ error: "GPS or City required" });
    }

    const radius = 5000; // 5KM

    // Overpass Query
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

    const hospitals = elements.map((el) => {
      const hLat = el.lat || (el.center && el.center.lat);
      const hLon = el.lon || (el.center && el.center.lon);
      return {
        id: el.id,
        name: (el.tags && (el.tags.name || el.tags["official_name"])) || "Unknown Hospital",
        lat: hLat,
        lon: hLon,
        dist: getDistance(lat, lon, hLat, hLon),
        address: {
          street: el.tags && (el.tags["addr:street"] || ""),
          city: el.tags && (el.tags["addr:city"] || ""),
        },
        phone: el.tags && (el.tags.phone || el.tags["contact:phone"] || null),
      };
    })
    .filter(h => h.lat && h.lon)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5);

    res.json({ location: displayName, center: { lat, lon }, count: hospitals.length, hospitals });

  } catch (err) {
    console.error("Hospitals lookup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------------------------
// 6. FEATURE: CRASH-PROOF NOTIFICATIONS (Your Logic)
// ------------------------------------------------
app.get("/notifications/:email", async (req, res) => {
  try {
    // USE .lean() TO AVOID SCHEMA ERRORS
    const user = await EmployeeModel.findOne({ email: req.params.email }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const allNotifications = [];

    // A. DB Notifications (Emergency)
    if (user.notifications && Array.isArray(user.notifications)) {
      user.notifications.forEach(n => {
        if (typeof n === 'object' && n !== null) {
          allNotifications.push({
            message: n.message || "New Alert",
            type: n.type || "alert",
            date: n.date || new Date()
          });
        }
      });
    }

    // B. Vaccine Calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.vaccinations && Array.isArray(user.vaccinations)) {
      user.vaccinations.forEach((vac) => {
        if (!vac.completed && vac.nextDoseDate) {
          const doseDate = new Date(vac.nextDoseDate);
          doseDate.setHours(0, 0, 0, 0);
          
          const diffTime = doseDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays >= 0 && diffDays <= 7) {
            let msg = diffDays === 0 
              ? `Today is your vaccination date for ${vac.vaccineName}`
              : `Upcoming: ${vac.vaccineName} in ${diffDays} days.`;
              
            allNotifications.push({
              message: msg,
              type: "vaccine",
              date: vac.nextDoseDate
            });
          }
        }
      });
    }

    allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ notifications: allNotifications });

  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------
// 7. FEATURE: EMERGENCY ALERT (Your "Force Fix" Logic)
// ------------------------------------------------
app.post("/emergency/:email", async (req, res) => {
  try {
    console.log(`🚨 EMERGENCY TRIGGERED BY: ${req.params.email}`);
    const sender = await EmployeeModel.findOne({ email: req.params.email });
    
    if (!sender) return res.status(404).json({ error: "User not found" });

    const targets = [];
    if (sender.phonemem1) targets.push(String(sender.phonemem1).trim());
    if (sender.phonemem2) targets.push(String(sender.phonemem2).trim());

    const cleanTargets = targets.filter(t => t.length > 5);

    if (cleanTargets.length === 0) {
      return res.json({ status: "NoContacts", message: "No contacts found" });
    }

    const notificationPayload = {
      message: `🚨 EMERGENCY: ${sender.name} needs help! Location: ${sender.city || "Unknown"}. Call: ${sender.phone1 || "Unknown"}`,
      type: "emergency",
      date: new Date(),
      read: false
    };

    // DIRECT COLLECTION UPDATE (Bypasses Schema Validation)
    const result = await EmployeeModel.collection.updateMany(
      { 
        $or: [
          { phone1: { $in: cleanTargets } },
          { phone2: { $in: cleanTargets } }
        ]
      },
      { 
        $push: { notifications: notificationPayload } 
      }
    );

    console.log(`✅ Success! Sent to ${result.modifiedCount} users.`);

    res.json({
      status: "Success",
      matchedUsers: result.modifiedCount,
      message: "Alert sent successfully"
    });

  } catch (err) {
    console.error("EMERGENCY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------------
// 8. VACCINATION HELPERS & ROUTES
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

app.get("/vaccination/schedule/:email", async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.email }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    const schedule = buildSchedule(user);
    res.json({ user, schedule });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/user/:email/vaccination", async (req, res) => {
  let { vaccineName, nextDoseDate, doseNumber, totalDoses } = req.body;
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

app.delete("/user/:email/vaccination/:vaccineId", async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.vaccinations = user.vaccinations.filter(
      (vac) => vac._id.toString() !== req.params.vaccineId
    );
    await user.save();
    res.json({ status: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// CRON JOB
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});