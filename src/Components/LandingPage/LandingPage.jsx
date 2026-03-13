import React from "react";
import styles from "./LandingPage.module.css";
import { useHistory } from "react-router-dom";
import apiClient from "../../api/client";

const todayYYYYMMDD = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const LandingPage = () => {
  const history = useHistory();
  const [departure, setDeparture] = React.useState("");
  const [arrival, setArrival] = React.useState("");
  const [date, setDate] = React.useState(todayYYYYMMDD());

  const [liveBuses, setLiveBuses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadLiveBuses = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get("/buses");
      setLiveBuses(data.buses || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load buses");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLiveBuses();
  }, []);

  const searchBuses = () => {
    if (!departure || !arrival) {
      alert("Please enter source and destination");
      return;
    }

    history.push(`/select-bus?departure=${departure}&arrival=${arrival}&date=${date || todayYYYYMMDD()}`);
  };

  return (
    <div>
      <div className={styles.LandingPage__mainBanner}>
        <div className={styles.LandingPage__form}>
          <div className={styles.LandingPage__form__field}>
            <input
              type="text"
              placeholder="Source"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>
          <div className={styles.LandingPage__form__field}>
            <input
              type="text"
              placeholder="Destination"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />
          </div>
          <div className={styles.LandingPage__form__field}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles.LandingPage__form__button}>
            <button onClick={searchBuses}>Search Bus</button>
          </div>
        </div>
      </div>

      <div className={styles.liveSection}>
        <div className={styles.liveSectionHeader}>
          <h2>Available Buses</h2>
          <button onClick={loadLiveBuses}>Refresh</button>
        </div>

        {loading && <p>Loading buses...</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && !error && liveBuses.length === 0 && (
          <p>No buses available. Ask admin to create bus entries from admin dashboard.</p>
        )}

        <div className={styles.liveGrid}>
          {liveBuses.map((bus) => {
            const departureDate = new Date(bus.departureTime);
            const arrivalDate = new Date(bus.arrivalTime);

            return (
              <div key={bus._id} className={styles.busCard}>
                <div className={styles.busCardTop}>
                  <h3>{bus.operatorName}</h3>
                  <span>{bus.busNumber}</span>
                </div>

                <p className={styles.busRoute}>{bus.source} to {bus.destination}</p>

                <div className={styles.timeRow}>
                  <div className={styles.timeItem}>
                    <span>Departure</span>
                    <strong>
                      {departureDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </strong>
                  </div>
                  <div className={styles.timeDivider}></div>
                  <div className={styles.timeItem}>
                    <span>Arrival</span>
                    <strong>
                      {arrivalDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </strong>
                  </div>
                </div>

                <div className={styles.metaRow}>
                  <p>
                    Fare: <strong>Rs. {bus.fare}</strong>
                  </p>
                  <p>
                    Seats: <strong>{bus.availableSeats}/{bus.totalSeats}</strong>
                  </p>
                </div>

                <button
                  className={styles.bookNowBtn}
                  onClick={() =>
                    history.push(
                      `/select-bus?departure=${bus.source}&arrival=${bus.destination}&date=${date || todayYYYYMMDD()}`
                    )
                  }
                >
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;