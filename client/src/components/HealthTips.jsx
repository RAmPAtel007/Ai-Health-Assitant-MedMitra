import React from "react";
import "./HealthTips.css";

export default function HealthTips() {
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

  return (
    <div className="tips-container">
      <h2 className="tips-title">Daily Health Tips</h2>

      <div className="tips-list">
        {healthTips.map((tip, index) => (
          <div key={index} className="tip-card">
            <span className="tip-number">Tip {index + 1}</span>
            <p className="tip-text">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
