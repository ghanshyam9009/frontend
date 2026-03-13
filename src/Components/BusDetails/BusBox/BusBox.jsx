import React from "react";
import styles from "./BusBox.module.css";
import StarsIcon from "@material-ui/icons/Stars";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import PeopleIcon from "@material-ui/icons/People";
import PowerIcon from "@material-ui/icons/Power";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import Tooltip from "@material-ui/core/Tooltip";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import RestoreIcon from "@material-ui/icons/Restore";
import { BottomTabs } from "../BottomTabs/BottomTabs";
import { useDispatch } from "react-redux";
import { updateBookingDetails } from "../../../Redux/BookBus/action";

const BusBox = ({
  _id,
  rating = [1, 1, 1, 1, 1],
  operatorName,
  busType,
  departureTime,
  arrivalHour,
  liveTracking,
  reschedulable,
  filledSeats = [],
  routeDetails,
  fare,
  totalSeats,
  durationHours,
}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(
      updateBookingDetails({
        key: "duration",
        value: durationHours || routeDetails.duration,
      })
    );
  }, [durationHours, routeDetails, dispatch]);

  let avgRating = 0;
  let totalReviews = 0;
  rating.forEach((item, index) => {
    avgRating += (index + 1) * item;
    totalReviews += item;
  });
  avgRating = totalReviews ? (avgRating / totalReviews).toFixed(1) : "4.0";

  let busTypeName = "Seater";
  if (busType === 2) busTypeName = "Sleeper";
  if (busType === 3) busTypeName = "A/C Seater";
  if (busType === 4) busTypeName = "Non - A/C";

  const availableSeats = Math.max((totalSeats || 40) - filledSeats.length, 0);

  return (
    <div className={styles.busBox}>
      <div className={styles.busBoxSection1}>
        <div className={styles.busBoxSection11}>
          <div>{operatorName}</div>
          <div>{busTypeName}</div>
        </div>
        <div className={styles.busBoxSection12}>
          <div>{departureTime}:00</div>
          <div>{routeDetails.departureLocation.name}</div>
        </div>
        <div className={styles.busBoxSection13}>
          <div>{durationHours || routeDetails.duration}&nbsp;h</div>
        </div>
        <div className={styles.busBoxSection14}>
          <div>{arrivalHour}:00</div>
          <div>{routeDetails.arrivalLocation.name}</div>
        </div>
        <div className={styles.busBoxSection15}>
          <div>
            <StarsIcon />
            <div>{avgRating}</div>
          </div>
          <div>
            <PeopleIcon />
            <div>{totalReviews}</div>
          </div>
        </div>
        <div className={styles.busBoxSection16}>
          <div>
            <div>INR</div>
            <div>{fare}</div>
          </div>
          <div>
            <LocalOfferIcon />
            <div>redDeal applied</div>
          </div>
        </div>
        <div className={styles.busBoxSection17}>
          <div></div>
          <div>
            <div>{availableSeats}</div>
            <div>Seats Available</div>
          </div>
          <div>
            <div>{Math.max(Math.floor(availableSeats / 2), 0)}</div>
            <div>Window</div>
          </div>
        </div>
      </div>
      <div className={styles.busBoxSection2}>
        <div className={styles.busBoxSection21}>
          <Tooltip title="Charging Point" arrow>
            <PowerIcon style={{ fontSize: "20px", marginRight: "9px", color: "grey" }} />
          </Tooltip>
          <Tooltip title="Movie" arrow>
            <MovieFilterIcon style={{ fontSize: "20px", marginRight: "9px", color: "grey" }} />
          </Tooltip>
          <Tooltip title="Reading Light" arrow>
            <WbIncandescentIcon style={{ fontSize: "20px", marginRight: "9px", color: "grey" }} />
          </Tooltip>
          <Tooltip title="Track My Bus" arrow>
            <DirectionsBusIcon style={{ fontSize: "20px", marginRight: "9px", color: "grey" }} />
          </Tooltip>
        </div>
        <div className={styles.busBoxSection22}>
          {liveTracking === 1 && (
            <div>
              <GpsFixedIcon style={{ fontSize: "20px", marginRight: "6px" }} />
              <span>Live Tracking</span>
            </div>
          )}
          {reschedulable === 1 && (
            <div>
              <RestoreIcon style={{ fontSize: "20px", marginRight: "6px" }} />
              <span>Reschedulable</span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.busBoxSection3}>
        <BottomTabs
          filledSeats={filledSeats}
          seatPrice={fare}
          routeDetails={routeDetails}
          busId={_id}
          busArrivalTime={arrivalHour}
          busDepartureTime={departureTime}
          operatorName={operatorName}
          totalSeats={totalSeats || 40}
        />
      </div>
    </div>
  );
};

export { BusBox };
