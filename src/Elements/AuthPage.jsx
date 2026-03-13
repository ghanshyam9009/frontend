import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../Redux/auth/actions";
import "./AuthPage.css";

const initialLogin = {
  email: "",
  password: "",
};

const initialRegister = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const AuthPage = ({ mode: fixedMode }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const isLoading = useSelector((state) => state.authReducer.isLoading);
  const authError = useSelector((state) => state.authReducer.error);

  const modeFromRoute = params?.mode === "login" ? "login" : params?.mode === "register" ? "register" : null;
  const resolvedMode = fixedMode || modeFromRoute || "register";

  const [mode, setMode] = React.useState(resolvedMode);
  const [localError, setLocalError] = React.useState("");
  const [loginForm, setLoginForm] = React.useState(initialLogin);
  const [registerForm, setRegisterForm] = React.useState(initialRegister);

  React.useEffect(() => {
    setMode(resolvedMode);
    setLocalError("");
  }, [resolvedMode]);

  React.useEffect(() => {
    if (isLoggedIn) {
      history.replace("/my-profile");
    }
  }, [isLoggedIn, history]);

  const goToMode = (nextMode) => {
    history.push(nextMode === "login" ? "/login" : "/register");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!loginForm.email || !loginForm.password) {
      setLocalError("Email and password are required");
      return;
    }

    const result = await dispatch(loginUser(loginForm));
    if (result.ok) {
      history.replace("/my-profile");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setLocalError("Name, email and password are required");
      return;
    }

    const result = await dispatch(registerUser(registerForm));
    if (result.ok) {
      history.replace("/my-profile");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-card">
        <div className="auth-page-head">
          <h1>{mode === "login" ? "Sign in to continue" : "Create your account"}</h1>
          <p>{mode === "login" ? "Access bookings, profile and trips instantly." : "Register once and book seats faster on your next trip."}</p>
        </div>

        <div className="auth-page-tabs">
          <button
            className={`auth-page-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => goToMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`auth-page-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => goToMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-page-form" onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
            />
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
            />
            <button className="auth-page-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-page-form" onSubmit={handleRegister}>
            <label>Name</label>
            <input
              type="text"
              value={registerForm.name}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
            />
            <label>Email</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
            />
            <label>Phone</label>
            <input
              type="text"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="9876543210"
            />
            <label>Password</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Min 8 chars with A-z and number"
            />
            <button className="auth-page-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Register"}
            </button>
          </form>
        )}

        {(localError || authError) && <p className="auth-page-error">{localError || authError}</p>}

        <div className="auth-page-footer">
          <Link to="/">Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
