import React from "react";
import AirlineSeatReclineExtraIcon from "@material-ui/icons/AirlineSeatReclineExtra";
import styles from "./SmallSeat.module.css";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const SmallSeat = ({
  seatNo,
  alreadyBookedSeats,
  handleSelectedSeats,
  selectedSeats,
}) => {
  let color;

  if (selectedSeats.includes(seatNo)) {
    color = { color: "blue" };
  } else {
    color = { color: "black" };
  }

  if (alreadyBookedSeats.includes(seatNo)) {
    color = { color: "red" };
  }

  const currentCustomer = useSelector((state) => state.authReducer.currentCustomer);
  const history = useHistory();

  const handleSeatBooking = () => {
    if (!currentCustomer) {
      history.push("/login");
      return;
    }

    if (!alreadyBookedSeats.includes(seatNo)) {
      handleSelectedSeats(seatNo);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Tooltip title={seatNo} arrow onClick={handleSeatBooking} style={color}>
        <AirlineSeatReclineExtraIcon />
      </Tooltip>
    </div>
  );
};

export { SmallSeat };
