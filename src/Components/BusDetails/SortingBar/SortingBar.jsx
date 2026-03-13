import React from "react";
import styles from "./SortingBar.module.css";
import Divider from "@material-ui/core/Divider";
import SecurityIcon from "@material-ui/icons/Security";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import UpdateIcon from "@material-ui/icons/Update";
import FlightLandIcon from "@material-ui/icons/FlightLand";
import StarRateIcon from "@material-ui/icons/StarRate";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventSeatIcon from "@material-ui/icons/EventSeat";
import { useDispatch, useSelector } from "react-redux";
import { updateFilterDetails } from "../../../Redux/FilterAndSort/action";

const sortOptions = [
  { key: "departure", label: "Departure", icon: AccessTimeIcon },
  { key: "duration", label: "Duration", icon: UpdateIcon },
  { key: "arrivals", label: "Arrivals", icon: FlightLandIcon },
  { key: "ratings", label: "Ratings", icon: StarRateIcon, disabled: true },
  { key: "fare", label: "Fare", icon: LocalOfferIcon },
  { key: "seatsAvailable", label: "Seats Available", icon: EventSeatIcon },
];

const SortingBar = () => {
  const dispatch = useDispatch();
  const sortingProperty = useSelector((state) => state.updateFilterDetailsReducer.sortingProperty);

  const handleSortProperty = (value, disabled) => {
    if (disabled) return;
    dispatch(
      updateFilterDetails({
        key: "sortingProperty",
        value,
      })
    );
  };

  return (
    <>
      <div className={styles.securityContainer}>
        <SecurityIcon className={styles.securityIcon} />
        <div>All bus ratings include safety as a major factor</div>
      </div>
      <Divider />
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer1}>
          <div>BUSES LIST</div>
          <div>SORT BY :</div>
        </div>
        <div className={styles.sortPillsWrap}>
          {sortOptions.map((option) => {
            const IconComp = option.icon;
            const isActive = sortingProperty === option.key;
            return (
              <button
                key={option.key}
                type="button"
                className={`${styles.sortPill} ${isActive ? styles.sortPillActive : ""} ${option.disabled ? styles.sortPillDisabled : ""}`}
                onClick={() => handleSortProperty(option.key, option.disabled)}
              >
                <IconComp style={{ fontSize: "16px" }} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export { SortingBar };
