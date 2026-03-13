import React from "react";
import styles from "./Header.module.css";
import { useLocation } from "react-router-dom";

const todayYYYYMMDD = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const Header = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const departure = query.get("departure") || "Source";
  const arrival = query.get("arrival") || "Destination";
  const date = query.get("date") || todayYYYYMMDD();

  return (
    <div className={styles.Header}>
      <div className={styles.HeaderOne}>
        <p>
          Home &gt; Bus Tickets &gt; {departure} Bus &gt; {departure} To {arrival} Bus
        </p>
        <p>Fares and seats are loaded from live backend data</p>
      </div>

      <div className={styles.HeaderTwo}>
        <h3>{departure} to {arrival}</h3>
        <span className={styles.dateChip}>{date}</span>
      </div>
    </div>
  );
};

export default Header;