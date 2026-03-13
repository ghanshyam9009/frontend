import * as actionTypes from "./actionTypes";
import apiClient from "../../api/client";

const authRequest = () => ({ type: actionTypes.AUTH_REQUEST });

const authSuccess = (payload) => ({
  type: actionTypes.AUTH_SUCCESS,
  payload,
});

const authFailure = (payload) => ({
  type: actionTypes.AUTH_FAILURE,
  payload,
});

const updateTokens = (payload) => ({
  type: actionTypes.UPDATE_TOKENS,
  payload,
});

const persistSession = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem("accessToken", accessToken || "");
  localStorage.setItem("refreshToken", refreshToken || "");
  localStorage.setItem("currentCustomer", JSON.stringify(user || null));
};

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentCustomer");
};

export const initializeAuth = () => (dispatch) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const userRaw = localStorage.getItem("currentCustomer");

  if (!accessToken || !userRaw) {
    return;
  }

  try {
    const user = JSON.parse(userRaw);
    dispatch(
      authSuccess({
        accessToken,
        refreshToken,
        user,
      })
    );
  } catch (error) {
    clearSession();
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await apiClient.post("/auth/login", credentials);

    const payload = {
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    };

    persistSession(payload);
    dispatch(authSuccess(payload));

    return { ok: true, data };
  } catch (error) {
    const message = error?.response?.data?.message || "Login failed";
    dispatch(authFailure(message));
    return { ok: false, message };
  }
};

export const registerUser = (payloadBody) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await apiClient.post("/auth/register", payloadBody);

    const payload = {
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    };

    persistSession(payload);
    dispatch(authSuccess(payload));

    return { ok: true, data };
  } catch (error) {
    const message = error?.response?.data?.message || "Registration failed";
    dispatch(authFailure(message));
    return { ok: false, message };
  }
};

export const refreshAccessToken = () => async (dispatch) => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return { ok: false, message: "No refresh token" };
  }

  try {
    const { data } = await apiClient.post("/auth/refresh-token", { refreshToken });

    const payload = {
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      user: data.user,
    };

    persistSession(payload);
    dispatch(updateTokens(payload));

    return { ok: true, data };
  } catch (error) {
    clearSession();
    dispatch({ type: actionTypes.LOGOUT });
    return { ok: false, message: "Session expired" };
  }
};

export const logoutUser = () => async (dispatch) => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refreshToken });
    }
  } catch (error) {
    // Ignore server logout failures and clear local state anyway.
  }

  clearSession();
  dispatch({ type: actionTypes.LOGOUT });
};
