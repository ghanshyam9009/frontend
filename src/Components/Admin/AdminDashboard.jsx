import React from "react";
import { useSelector } from "react-redux";
import apiClient from "../../api/client";
import styles from "./AdminDashboard.module.css";

const initialBusForm = {
  busNumber: "",
  operatorName: "",
  source: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  fare: "",
  totalSeats: "",
  amenities: "",
};

const AdminDashboard = () => {
  const currentCustomer = useSelector((state) => state.authReducer.currentCustomer);
  const [busForm, setBusForm] = React.useState(initialBusForm);
  const [editingBusId, setEditingBusId] = React.useState("");

  const [buses, setBuses] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [error, setError] = React.useState("");

  const loadAll = async () => {
    try {
      setError("");
      const [busRes, userRes, bookingRes] = await Promise.all([
        apiClient.get("/admin/buses"),
        apiClient.get("/admin/users"),
        apiClient.get("/admin/bookings"),
      ]);
      setBuses(busRes.data.buses || []);
      setUsers(userRes.data.users || []);
      setBookings(bookingRes.data.bookings || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin data");
    }
  };

  React.useEffect(() => {
    if (currentCustomer?.role === "admin") {
      loadAll();
    }
  }, [currentCustomer]);

  if (!currentCustomer) {
    return <div className={styles.wrapper}><h2>Please login as admin.</h2></div>;
  }

  if (currentCustomer.role !== "admin") {
    return <div className={styles.wrapper}><h2>Access denied. Admin only.</h2></div>;
  }

  const handleCreateOrUpdateBus = async () => {
    const payload = {
      ...busForm,
      fare: Number(busForm.fare),
      totalSeats: Number(busForm.totalSeats),
      amenities: busForm.amenities
        ? busForm.amenities.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingBusId) {
        await apiClient.put(`/admin/buses/${editingBusId}`, payload);
      } else {
        await apiClient.post("/admin/buses", payload);
      }
      setBusForm(initialBusForm);
      setEditingBusId("");
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save bus");
    }
  };

  const editBus = (bus) => {
    setEditingBusId(bus._id);
    setBusForm({
      busNumber: bus.busNumber || "",
      operatorName: bus.operatorName || "",
      source: bus.source || "",
      destination: bus.destination || "",
      departureTime: bus.departureTime ? new Date(bus.departureTime).toISOString().slice(0, 16) : "",
      arrivalTime: bus.arrivalTime ? new Date(bus.arrivalTime).toISOString().slice(0, 16) : "",
      fare: bus.fare || "",
      totalSeats: bus.totalSeats || "",
      amenities: (bus.amenities || []).join(", "),
    });
  };

  const deleteBus = async (id) => {
    try {
      await apiClient.delete(`/admin/buses/${id}`);
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete bus");
    }
  };

  const handleCancellation = async (id, action) => {
    try {
      await apiClient.patch(`/admin/bookings/${id}/cancellation`, { action });
      loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to process cancellation");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.section}>
        <h3>{editingBusId ? "Update Bus" : "Create Bus"}</h3>
        <div className={styles.grid}>
          <input className={styles.input} placeholder="Bus Number" value={busForm.busNumber} onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })} />
          <input className={styles.input} placeholder="Operator Name" value={busForm.operatorName} onChange={(e) => setBusForm({ ...busForm, operatorName: e.target.value })} />
          <input className={styles.input} placeholder="Source" value={busForm.source} onChange={(e) => setBusForm({ ...busForm, source: e.target.value })} />
          <input className={styles.input} placeholder="Destination" value={busForm.destination} onChange={(e) => setBusForm({ ...busForm, destination: e.target.value })} />
          <input className={styles.input} type="datetime-local" value={busForm.departureTime} onChange={(e) => setBusForm({ ...busForm, departureTime: e.target.value })} />
          <input className={styles.input} type="datetime-local" value={busForm.arrivalTime} onChange={(e) => setBusForm({ ...busForm, arrivalTime: e.target.value })} />
          <input className={styles.input} type="number" placeholder="Fare" value={busForm.fare} onChange={(e) => setBusForm({ ...busForm, fare: e.target.value })} />
          <input className={styles.input} type="number" placeholder="Total Seats" value={busForm.totalSeats} onChange={(e) => setBusForm({ ...busForm, totalSeats: e.target.value })} />
          <input className={styles.input} placeholder="Amenities (comma separated)" value={busForm.amenities} onChange={(e) => setBusForm({ ...busForm, amenities: e.target.value })} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button className={styles.button} onClick={handleCreateOrUpdateBus}>{editingBusId ? "Update Bus" : "Create Bus"}</button>
          {editingBusId && (
            <button className={styles.button} style={{ marginLeft: 8 }} onClick={() => { setEditingBusId(""); setBusForm(initialBusForm); }}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3>All Buses</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>Bus No</th><th>Operator</th><th>Route</th><th>Fare</th><th>Seats</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td>{bus.busNumber}</td>
                <td>{bus.operatorName}</td>
                <td>{bus.source} - {bus.destination}</td>
                <td>{bus.fare}</td>
                <td>{bus.availableSeats}/{bus.totalSeats}</td>
                <td>
                  <button className={styles.button} onClick={() => editBus(bus)}>Edit</button>
                  <button className={styles.button} style={{ marginLeft: 6 }} onClick={() => deleteBus(bus._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h3>All Users</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.section}>
        <h3>All Bookings</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>User</th><th>Bus</th><th>Seats</th><th>Status</th><th>Travel Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.user?.name || "-"}</td>
                <td>{booking.bus?.busNumber || "-"}</td>
                <td>{(booking.seatNumbers || []).join(", ")}</td>
                <td>{booking.status}</td>
                <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                <td>
                  {booking.status === "cancellation_requested" ? (
                    <>
                      <button className={styles.button} onClick={() => handleCancellation(booking._id, "approve")}>Approve</button>
                      <button className={styles.button} style={{ marginLeft: 6 }} onClick={() => handleCancellation(booking._id, "reject")}>Reject</button>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
