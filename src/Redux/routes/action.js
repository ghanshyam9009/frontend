import * as actionTypes from "./actionTypes";

const getRoutesRequest = () => ({ type: actionTypes.GET_ROUTES_REQUEST });
const getRoutesSuccess = (routes) => ({
  type: actionTypes.GET_ROUTES_SUCCESS,
  payload: routes,
});
const getRoutesFailure = () => ({ type: actionTypes.GET_ROUTES_FAILURE });

const getRoutes = () => {
  return async (dispatch) => {
    dispatch(getRoutesRequest());
    try {
      dispatch(getRoutesSuccess([]));
    } catch (err) {
      dispatch(getRoutesFailure());
    }
  };
};

export { getRoutes };
