import React from "react";
import Styles from "./Payment.module.css";
import { MdAccountCircle } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import apiClient from "../../api/client";

const Payment = () => {
  const history = useHistory();

  const passSeatsArray = useSelector((state) => state.busDetailsReducer.seats);
  const passFare = useSelector((state) => state.busDetailsReducer.fare);
  const passDepartDetails = useSelector((state) => state.busDetailsReducer.departureDetails);
  const passArrivalDetails = useSelector((state) => state.busDetailsReducer.arrivalDetails);

  const currentCustomer = useSelector((state) => state.authReducer.currentCustomer);
  const operatorName = useSelector((state) => state.busDetailsReducer.operatorName);
  const busId = useSelector((state) => state.busDetailsReducer.busId);
  const travelDate = useSelector((state) => state.busDetailsReducer.travelDate);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const confirmBooking = async () => {
    if (!currentCustomer) {
      history.push("/login");
      return;
    }

    if (!busId || passSeatsArray.length === 0) {
      alert("Please select seats first");
      history.push("/");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post("/bookings", {
        busId,
        seatNumbers: passSeatsArray,
        travelDate: passDepartDetails.date || travelDate,
        boardingPoint: passDepartDetails.location,
        droppingPoint: passArrivalDetails.location,
      });

      alert("Booking successful");
      history.push("/my-profile");
    } catch (error) {
      const msg = error?.response?.data?.message || "Booking failed";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return (
    <div>
      <div className={Styles.payment__fullContainer}>
        <div className={Styles.payment__fullContainer_leftContainer}>
          <input className={Styles.payment__fullContainer_rightContainer_inputOfferCOde} placeholder="ENTER OFFER CODE" />
          <div className={Styles.payment__fullContainer_rightContainer_infobar}></div>

          <div className={Styles.Payment__stripe}>
            <button
              className={Styles.Payment__stripe__button}
              onClick={confirmBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>

        <div className={Styles.payment__fullContainer_rightContainer}>
          <div className={Styles.payment__fullContainer_rightContainer_trip_container}>
            <div className={Styles.travel_operator_info}>
              <div className={Styles.travel_title}>{operatorName}</div>
              <div className={Styles.travel_specification}>Seater / Sleeper</div>
            </div>
            <div className={Styles.line}></div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
                <MdDateRange className={Styles.icons} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.travel_specification}>Booking Date</div>
                  <div style={{ display: "flex", width: "150px" }}>
                    <div>{year + "/" + month + "/" + day}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
                <div>Seats Booked</div>
                <div>{passSeatsArray.join(", ")}</div>
              </div>
            </div>
            <div className={Styles.line}></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "150px" }}>
                <VscLocation className={Styles.icons} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={Styles.travel_specification}>Boarding Point</div>
                  <div>{passDepartDetails.city}</div>
                  <div>{passDepartDetails.location}</div>
                  <div>{passDepartDetails.date}</div>
                  <div>{passDepartDetails.time}:00</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className={Styles.travel_specification}>Dropping Point</div>
                <div>{passArrivalDetails.city}</div>
                <div>{passArrivalDetails.location}</div>
                <div>{passArrivalDetails.date}</div>
                <div>{passArrivalDetails.time}:00</div>
              </div>
            </div>
            <div className={Styles.passangerInfo}>
              <MdAccountCircle className={Styles.icons} />
              <div className={Styles.passangerName}>{currentCustomer?.name || "Guest"}</div>
            </div>
          </div>

          <div className={Styles.payment__fullContainer_rightContainer_fair_container}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className={Styles.travel_title}>FARE BREAKUP</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <div className={Styles.travel_specification} style={{ fontWeight: "bold" }}>
                Total Payable
              </div>
              <div className={Styles.travel_specification} style={{ fontWeight: "bold" }}>
                Rs. {passFare}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;


