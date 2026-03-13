import React from "react";
import styles from "./SubRoutes.module.css";
import { useDispatch } from "react-redux";
import { updateBookingDetails } from "../../../Redux/BookBus/action";
import { useLocation } from "react-router-dom";

const SubRoutes = ({ handleBoardAndDrop, routeDetails, busArrivalTime, busDepartureTime }) => {
  const [boardPoint, setBoardPoint] = React.useState(routeDetails.departureLocation.name);
  const [destPoint, setDestPoint] = React.useState(routeDetails.arrivalLocation.name);

  const boardingSubpoints = routeDetails.departureLocation.subLocations || [routeDetails.departureLocation.name];
  const destinationSubpoints = routeDetails.arrivalLocation.subLocations || [routeDetails.arrivalLocation.name];

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const date = query.get("date") || routeDetails.travelDate;

  const dispatch = useDispatch();

  const handleContinue = () => {
    dispatch(
      updateBookingDetails({
        key: "departureDetails",
        value: {
          city: routeDetails.departureLocation.name,
          location: boardPoint,
          time: Number(busDepartureTime),
          date,
        },
      })
    );

    dispatch(
      updateBookingDetails({
        key: "arrivalDetails",
        value: {
          city: routeDetails.arrivalLocation.name,
          location: destPoint,
          time: Number(busArrivalTime),
          date,
        },
      })
    );

    handleBoardAndDrop();
  };

  const renderPointList = (items, name, selected, setSelected, time) => {
    return (
      <div className={styles.pointList} onChange={(e) => setSelected(e.target.value)}>
        {items.map((item) => (
          <label className={styles.pointRow} key={`${name}-${item}`}>
            <div className={styles.pointLeft}>
              <input type="radio" name={name} value={item} defaultChecked={item === selected} />
              <span className={styles.pointTime}>{time}:00</span>
            </div>
            <div className={styles.pointRight}>
              <span className={styles.pointName}>{item}</span>
            </div>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.columns}>
        <section className={styles.columnCard}>
          <h4>BOARDING POINT</h4>
          {renderPointList(boardingSubpoints, "board-address", boardPoint, setBoardPoint, busDepartureTime)}
        </section>

        <section className={styles.columnCard}>
          <h4>DROPPING POINT</h4>
          {renderPointList(destinationSubpoints, "dest-address", destPoint, setDestPoint, busArrivalTime)}
        </section>
      </div>

      <button className={styles.continueButton} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export { SubRoutes };