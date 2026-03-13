import React from "react";
import { ViewSeats } from "../ViewSeats/ViewSeats";
import styles from "./BottomTabs.module.css";
import { useDispatch } from "react-redux";
import { updateBookingDetails } from "../../../Redux/BookBus/action";

export const BottomTabs = (props) => {
  const [tabsState, setTabsState] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const tabLabels = [
    "Amenities",
    "Boarding and Dropping Points",
    "Reviews",
    "Booking Policies",
  ];

  const handleTabState = (value) => {
    const newState = [...tabsState];
    for (let i = 0; i < newState.length; i += 1) {
      if (i === value) {
        newState[i] = !newState[i];
      } else {
        newState[i] = false;
      }
    }
    setTabsState(newState);
  };

  const dispatch = useDispatch();
  const handleTabStateBus = (value) => {
    dispatch(
      updateBookingDetails({
        key: "operatorName",
        value: props.operatorName,
      })
    );
    handleTabState(value);
  };

  return (
    <>
      <div className={styles.mainBar}>
        <div className={styles.mainBarTabs}>
          {tabLabels.map((label, index) => (
            <button
              key={label}
              className={`${styles.tabBtn} ${tabsState[index] ? styles.tabBtnActive : ""}`}
              onClick={() => handleTabState(index)}
            >
              {label}
            </button>
          ))}
        </div>

        <button className={styles.viewSeatBtn} onClick={() => handleTabStateBus(4)}>
          VIEW SEATS
        </button>
      </div>

      {tabsState[0] && <div className={styles.displayArea}>Amenities</div>}
      {tabsState[1] && (
        <div className={styles.displayArea}>Boarding and Dropping Points</div>
      )}
      {tabsState[2] && <div className={styles.displayArea}>Reviews</div>}
      {tabsState[3] && <div className={styles.displayArea}>Booking Policies</div>}
      {tabsState[4] && <ViewSeats {...props} />}
    </>
  );
};