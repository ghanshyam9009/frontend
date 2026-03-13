import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../Redux/auth/actions";
import "./AuthModal.css";

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

const AuthModal = ({ open, onClose, initialMode = "login", hideCancel = false }) => {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.authReducer.error);
  const isLoading = useSelector((state) => state.authReducer.isLoading);

  const [mode, setMode] = React.useState(initialMode === "register" ? "register" : "login");
  const [loginForm, setLoginForm] = React.useState(initialLogin);
  const [registerForm, setRegisterForm] = React.useState(initialRegister);
  const [localError, setLocalError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setLocalError("");
      return;
    }

    setMode(initialMode === "register" ? "register" : "login");
    setLocalError("");
  }, [open, initialMode]);

  const handleLogin = async () => {
    setLocalError("");
    if (!loginForm.email || !loginForm.password) {
      setLocalError("Email and password are required");
      return;
    }

    const result = await dispatch(loginUser(loginForm));
    if (result.ok) {
      onClose();
    }
  };

  const handleRegister = async () => {
    setLocalError("");
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setLocalError("Name, email and password are required");
      return;
    }

    const result = await dispatch(registerUser(registerForm));
    if (result.ok) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      classes={{ paper: "auth-modal-paper" }}
    >
      <div className="auth-modal-glow" />
      <DialogTitle className="auth-modal-title">
        {mode === "login" ? "Welcome Back" : "Create Your Account"}
      </DialogTitle>
      <DialogContent className="auth-modal-content">
        <Typography variant="body2" className="auth-modal-subtitle">
          {mode === "login"
            ? "Login to manage your trips and bookings."
            : "Register to book buses faster and track your rides."}
        </Typography>

        <Box display="flex" mb={2} className="auth-switch">
          <Button
            className={`auth-switch-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </Button>
          <Button
            className={`auth-switch-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </Button>
        </Box>

        {mode === "login" ? (
          <>
            <TextField
              className="auth-input"
              label="Email"
              type="email"
              variant="outlined"
              margin="dense"
              fullWidth
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <TextField
              className="auth-input"
              label="Password"
              type="password"
              variant="outlined"
              margin="dense"
              fullWidth
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </>
        ) : (
          <>
            <TextField
              className="auth-input"
              label="Name"
              variant="outlined"
              margin="dense"
              fullWidth
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              className="auth-input"
              label="Email"
              type="email"
              variant="outlined"
              margin="dense"
              fullWidth
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <TextField
              className="auth-input"
              label="Phone"
              variant="outlined"
              margin="dense"
              fullWidth
              value={registerForm.phone}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <TextField
              className="auth-input"
              label="Password"
              type="password"
              variant="outlined"
              margin="dense"
              fullWidth
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <Typography variant="caption" className="auth-password-tip">
              Use at least 8 chars with uppercase, lowercase and a number.
            </Typography>
          </>
        )}

        {(localError || authError) && (
          <Typography color="error" variant="body2" className="auth-error">
            {localError || authError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions className="auth-actions">
        {!hideCancel && (
          <Button onClick={onClose} className="auth-cancel-btn">
            Cancel
          </Button>
        )}
        <Button
          className="auth-submit-btn"
          variant="contained"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
