import React from "react";
import styles from "./SingleTrip.module.css";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
};

const formatTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (typeof value === "string" && /^\d{1,2}:\d{2}$/.test(value)) {
    return value;
  }

  if (typeof value === "number" && value >= 0 && value <= 23) {
    return `${String(value).padStart(2, "0")}:00`;
  }

  return "-";
};

const SingleTrip = ({ booking, onRequestCancel, onDownloadTicket, isDownloading }) => {
  const bus = booking.bus || {};
  const canRequestCancellation = booking.status === "booked";
  const statusClass =
    booking.status === "booked"
      ? styles.statusBooked
      : booking.status === "cancellation_requested"
      ? styles.statusRequested
      : styles.statusCancelled;

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <div>
          <h3>{bus.operatorName || "Bus Trip"}</h3>
          <p>
            {bus.source || "-"} to {bus.destination || "-"}
          </p>
        </div>
        <div className={`${styles.statusBadge} ${statusClass}`}>{booking.status}</div>
      </header>

      <div className={styles.cardBody}>
        <section className={styles.section}>
          <h4>Bus Details</h4>
          <div className={styles.metaGrid}>
            <div><span>Bus Number</span><strong>{bus.busNumber || "-"}</strong></div>
            <div><span>Travel Date</span><strong>{formatDate(booking.travelDate)}</strong></div>
            <div><span>Departure</span><strong>{formatTime(bus.departureTime)}</strong></div>
            <div><span>Arrival</span><strong>{formatTime(bus.arrivalTime)}</strong></div>
            <div><span>Boarding Point</span><strong>{booking.boardingPoint || "-"}</strong></div>
            <div><span>Dropping Point</span><strong>{booking.droppingPoint || "-"}</strong></div>
          </div>
        </section>

        <section className={styles.section}>
          <h4>Booking Details</h4>
          <div className={styles.metaGrid}>
            <div><span>Seat Numbers</span><strong>{(booking.seatNumbers || []).join(", ") || "-"}</strong></div>
            <div><span>Seats Booked</span><strong>{booking.seatsBooked || 0}</strong></div>
            <div><span>Total Fare</span><strong>Rs. {booking.totalAmount || 0}</strong></div>
            <div><span>Booking ID</span><strong>{booking._id?.slice(-8) || "-"}</strong></div>
          </div>

          {booking.cancellationReason ? (
            <p className={styles.reason}>Reason: {booking.cancellationReason}</p>
          ) : null}

          <div className={styles.actionRow}>
            <button
              className={styles.ticketBtn}
              onClick={() => onDownloadTicket(booking._id)}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing PDF..." : "Download Ticket PDF"}
            </button>

            {canRequestCancellation && (
              <button className={styles.cancelBtn} onClick={() => onRequestCancel(booking._id)}>
                Request Cancellation
              </button>
            )}
          </div>
        </section>
      </div>
    </article>
  );
};

export default SingleTrip;
