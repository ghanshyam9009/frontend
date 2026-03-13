import React from "react";
import styles from "./Right.module.css";
import { BusBox } from "../BusDetails/BusBox/BusBox";
import { SortingBar } from "../BusDetails/SortingBar/SortingBar";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBusDetails } from "../../Redux/BookBus/action";

const Right = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const departure = query.get("departure");
  const arrival = query.get("arrival");
  const date = query.get("date");

  const isLoading = useSelector((state) => state.busDetailsReducer.isLoading);
  const isError = useSelector((state) => state.busDetailsReducer.isError);
  const errorMessage = useSelector((state) => state.busDetailsReducer.errorMessage);
  const isSuccess = useSelector((state) => state.busDetailsReducer.isSuccess);
  const routeDetails = useSelector((state) => state.busDetailsReducer.routeDetails);
  const matchedBuses = useSelector((state) => state.busDetailsReducer.matchedBuses);
  const busIdWithSeatsObj = useSelector((state) => state.busDetailsReducer.busIdWithSeatsObj);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getBusDetails(departure, arrival, date));
  }, [arrival, date, departure, dispatch]);

  let filteredMatchedBuses = [...matchedBuses];

  const checkBusType = useSelector((state) => state.updateFilterDetailsReducer.busType);
  if (checkBusType.seater || checkBusType.sleeper || checkBusType.ac || checkBusType.nonac) {
    filteredMatchedBuses = filteredMatchedBuses.filter((item) => {
      return (
        (checkBusType.seater && item.busType === 1) ||
        (checkBusType.sleeper && item.busType === 2) ||
        (checkBusType.ac && item.busType === 3) ||
        (checkBusType.nonac && item.busType === 4)
      );
    });
  }

  const checkDepartTime = useSelector((state) => state.updateFilterDetailsReducer.departureTime);
  if (checkDepartTime.before6am || checkDepartTime["6amto12pm"] || checkDepartTime["12pmto6pm"] || checkDepartTime.after6pm) {
    filteredMatchedBuses = filteredMatchedBuses.filter((item) => {
      return (
        (checkDepartTime.before6am && item.departureTime < 6) ||
        (checkDepartTime["6amto12pm"] && item.departureTime >= 6 && item.departureTime < 12) ||
        (checkDepartTime["12pmto6pm"] && item.departureTime >= 12 && item.departureTime < 18) ||
        (checkDepartTime.after6pm && item.departureTime >= 18)
      );
    });
  }

  const checkArrivalTime = useSelector((state) => state.updateFilterDetailsReducer.arrivalTime);
  if (checkArrivalTime.before6am || checkArrivalTime["6amto12pm"] || checkArrivalTime["12pmto6pm"] || checkArrivalTime.after6pm) {
    filteredMatchedBuses = filteredMatchedBuses.filter((item) => {
      const arriveTime = Number(item.arrivalHour);
      return (
        (checkArrivalTime.before6am && arriveTime < 6) ||
        (checkArrivalTime["6amto12pm"] && arriveTime >= 6 && arriveTime < 12) ||
        (checkArrivalTime["12pmto6pm"] && arriveTime >= 12 && arriveTime < 18) ||
        (checkArrivalTime.after6pm && arriveTime >= 18)
      );
    });
  }

  const sortingProperty = useSelector((state) => state.updateFilterDetailsReducer.sortingProperty);
  if (sortingProperty !== "None") {
    if (sortingProperty === "departure") {
      filteredMatchedBuses.sort((a, b) => Number(a.departureTime) - Number(b.departureTime));
    }
    if (sortingProperty === "duration") {
      filteredMatchedBuses.sort((a, b) => Number(a.durationHours) - Number(b.durationHours));
    }
    if (sortingProperty === "arrivals") {
      filteredMatchedBuses.sort((a, b) => Number(a.arrivalHour) - Number(b.arrivalHour));
    }
    if (sortingProperty === "fare") {
      filteredMatchedBuses.sort((a, b) => Number(a.fare) - Number(b.fare));
    }
    if (sortingProperty === "seatsAvailable") {
      filteredMatchedBuses.sort((a, b) => {
        const seatsA = (a.totalSeats || 0) - (busIdWithSeatsObj[a._id] || []).length;
        const seatsB = (b.totalSeats || 0) - (busIdWithSeatsObj[b._id] || []).length;
        return seatsB - seatsA;
      });
    }
  }

  return (
    <div className={styles.Right}>
      <SortingBar />
      {isLoading && <div>Loading buses...</div>}
      {isError && <div>{errorMessage || "Something went wrong"}</div>}

      {isSuccess && filteredMatchedBuses.length === 0 && <h1>No Bus Found.</h1>}

      {isSuccess &&
        filteredMatchedBuses.map((item) => (
          <BusBox
            key={item._id}
            {...item}
            filledSeats={busIdWithSeatsObj[item._id] || []}
            routeDetails={routeDetails}
          />
        ))}
    </div>
  );
};

export default Right;
