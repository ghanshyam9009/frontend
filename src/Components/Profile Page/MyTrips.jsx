import React from "react";
import styles from "./MyTrips.module.css";
import SingleTrip from "./SingleTrip";
import { useSelector } from "react-redux";
import apiClient from "../../api/client";

const MyTrips = () => {
  const [allBookings, setAllBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [downloadingBookingId, setDownloadingBookingId] = React.useState("");

  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/bookings/my");
      setAllBookings(res.data.bookings || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    } else {
      setLoading(false);
      setAllBookings([]);
    }
  }, [isLoggedIn]);

  const handleRequestCancel = async (bookingId) => {
    try {
      await apiClient.patch(`/bookings/${bookingId}/request-cancellation`, {
        reason: "Requested from profile",
      });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to request cancellation");
    }
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      setDownloadingBookingId(bookingId);

      const response = await apiClient.get(`/bookings/${bookingId}/ticket-pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers?.["content-disposition"] || "";
      const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
      const fileName = fileNameMatch?.[1] || `ticket-${bookingId.slice(-8).toUpperCase()}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to download ticket PDF");
    } finally {
      setDownloadingBookingId("");
    }
  };

  if (!isLoggedIn) {
    return <div className={styles.MyTrips}><h2>Please login to view your trips.</h2></div>;
  }

  if (loading) {
    return <div className={styles.MyTrips}><h2>Loading trips...</h2></div>;
  }

  if (error) {
    return <div className={styles.MyTrips}><h2>{error}</h2></div>;
  }

  if (allBookings.length === 0) {
    return <div className={styles.MyTrips}><h1>No Bookings Found!</h1></div>;
  }

  return (
    <div className={styles.MyTrips}>
      <div className={styles.tripsHeader}>
        <h2>My Trips</h2>
        <span>{allBookings.length} bookings</span>
      </div>
      <div className={styles.tripsList}>
        {[...allBookings].reverse().map((booking) => (
          <SingleTrip
            key={booking._id}
            booking={booking}
            onRequestCancel={handleRequestCancel}
            onDownloadTicket={handleDownloadTicket}
            isDownloading={downloadingBookingId === booking._id}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTrips;


