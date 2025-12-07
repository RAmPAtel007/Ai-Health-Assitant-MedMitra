import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationCorner.css";

export default function NotificationCorner({ userEmail }) {
  const [notifications, setNotifications] = useState([]);

  // 🔥 Load notifications (single function)
  const loadNotifications = () => {
    if (!userEmail) return;

    axios
      .get(`http://localhost:3001/notifications/${userEmail}`)
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.log(err));
  };

  // 🔥 Load once when component loads
  useEffect(() => {
    loadNotifications();
  }, [userEmail]);

  // 🔥 Refresh every 20 seconds
  useEffect(() => {
    if (!userEmail) return;

    const timer = setInterval(() => {
      loadNotifications();
    }, 20000);

    return () => clearInterval(timer);
  }, [userEmail]);

  return (
    <div className="notify-box">
      <span className="notify-title">🔔 Notifications</span>

      {notifications.length === 0 ? (
        <p className="none">No notifications</p>
      ) : (
        notifications.map((n, idx) => (
          <div key={idx} className="notify-item">
            {n.message}
          </div>
        ))
      )}
    </div>
  );
}
