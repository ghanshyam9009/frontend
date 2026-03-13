import {
  GET_BUS_DETAILS_FAIL,
  GET_BUS_DETAILS_REQUEST,
  GET_BUS_DETAILS_SUCCESS,
  UPDATE_BOOKING_DETAILS,
} from "./actionTypes";
import apiClient from "../../api/client";

const busDetailsRequest = () => ({
  type: GET_BUS_DETAILS_REQUEST,
});

const busDetailsSuccess = (payload) => ({
  type: GET_BUS_DETAILS_SUCCESS,
  payload,
});

export const updateBookingDetails = (payload) => ({
  type: UPDATE_BOOKING_DETAILS,
  payload,
});

const busDetailsFail = (payload) => ({
  type: GET_BUS_DETAILS_FAIL,
  payload,
});

const todayYYYYMMDD = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getDurationHours = (departureISO, arrivalISO) => {
  const dep = new Date(departureISO).getTime();
  const arr = new Date(arrivalISO).getTime();
  if (Number.isNaN(dep) || Number.isNaN(arr) || arr <= dep) {
    return 1;
  }

  return Math.max(1, Math.round((arr - dep) / (1000 * 60 * 60)));
};

const mapBusType = (amenities = []) => {
  const merged = amenities.join(" ").toLowerCase();
  if (merged.includes("sleeper")) return 2;
  if (merged.includes("ac")) return 3;
  if (merged.includes("non ac") || merged.includes("non-ac")) return 4;
  return 1;
};

export const getBusDetails = (depart, arrival, date) => async (dispatch) => {
  if (!depart || !arrival) {
    dispatch(busDetailsFail("Please select source and destination"));
    return;
  }

  const selectedDate = date || todayYYYYMMDD();

  dispatch(busDetailsRequest());
  try {
    const { data } = await apiClient.get("/buses/search", {
      params: {
        source: depart,
        destination: arrival,
        date: selectedDate,
        seats: 1,
      },
    });

    const buses = data?.buses || [];

    const seatResponses = await Promise.all(
      buses.map(async (bus) => {
        try {
          const response = await apiClient.get(`/buses/${bus._id}/seats`, {
            params: { date: selectedDate },
          });
          return {
            busId: bus._id,
            bookedSeats: response.data.bookedSeats || [],
            availableSeats: response.data.availableCount || 0,
          };
        } catch (error) {
          return { busId: bus._id, bookedSeats: [], availableSeats: bus.availableSeats || 0 };
        }
      })
    );

    const busIdWithSeatsObj = seatResponses.reduce((acc, item) => {
      acc[item.busId] = item.bookedSeats;
      return acc;
    }, {});

    const seatMap = seatResponses.reduce((acc, item) => {
      acc[item.busId] = item.availableSeats;
      return acc;
    }, {});

    const matchedBuses = buses.map((bus) => {
      const departureDate = new Date(bus.departureTime);
      const arrivalDate = new Date(bus.arrivalTime);

      return {
        ...bus,
        busType: mapBusType(bus.amenities || []),
        rating: [1, 2, 4, 8, 12],
        liveTracking: 0,
        reschedulable: 1,
        departureTime: departureDate.getHours(),
        arrivalHour: arrivalDate.getHours(),
        durationHours: getDurationHours(bus.departureTime, bus.arrivalTime),
        availableSeatsForDate: seatMap[bus._id],
      };
    });

    const routeDetails = {
      duration: matchedBuses[0]?.durationHours || 1,
      departureLocation: {
        name: depart,
        subLocations: [depart],
      },
      arrivalLocation: {
        name: arrival,
        subLocations: [arrival],
      },
      travelDate: selectedDate,
    };

    dispatch(
      busDetailsSuccess({
        route: routeDetails,
        matchedBuses,
        busIdWithSeatsObj,
      })
    );
  } catch (error) {
    const message = error?.response?.data?.message || "Unable to fetch buses";
    dispatch(busDetailsFail(message));
  }
};
