import * as actionTypes from "./actionTypes";

const initState = {
  isLoggedIn: false,
  currentCustomer: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  isLoading: false,
};





const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        currentCustomer: action.payload.user,
        error: null,
      };

    case actionTypes.UPDATE_TOKENS:
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        currentCustomer: action.payload.user || state.currentCustomer,
      };

    case actionTypes.AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        error: action.payload,
      };

    case actionTypes.LOGOUT:
      return {
        ...initState,
      };

    default:
      return state;
  }
};

export { authReducer };
