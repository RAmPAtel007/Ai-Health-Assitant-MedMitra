import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VaccinationSchedule.css";

export default function VaccinationSchedule({ userEmail }) {
  const [schedule, setSchedule] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      setError("User not logged in");
      return;
    }
    setLoading(true);
    axios.get(`http://localhost:3001/vaccination/schedule/${encodeURIComponent(userEmail)}`)
      .then(res => {
        setUser(res.data.user);
        setSchedule(res.data.schedule || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load schedule");
      })
      .finally(()=> setLoading(false));
  }, [userEmail]);

  if (loading) return <div className="vax-widget">Loading vaccination schedule...</div>;
  if (error) return <div className="vax-widget error">{error}</div>;

  return (
    <div className="vax-widget">
      <h3>Vaccination schedule for {user?.name || userEmail}</h3>
      <div className="vax-cards">
        {schedule.map(item => (
          <div key={item.vaccineName} className="vax-card">
            <h4>{item.vaccineName}</h4>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Doses taken:</strong> {item.dosesTaken} / {item.dosesRecommended}</p>
            <p>
              <strong>Next due:</strong>{" "}
              {item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : "Unknown"}
            </p>
            {item.status === "due" && (
              <button className="mark-btn" onClick={() => alert("Call POST /vaccination/add to mark dose taken")}>
                Mark dose taken
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
