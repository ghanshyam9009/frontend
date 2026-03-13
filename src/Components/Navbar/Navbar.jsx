import React from "react";
import styles from "./Navbar.module.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/auth/actions";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const currentCustomer = useSelector((state) => state.authReducer.currentCustomer);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setAnchorEl2(null);
    history.push("/");
  };

  const handleManageBooking = () => {
    if (isLoggedIn) {
      history.push("/my-profile");
      return;
    }

    history.push("/login");
  };

  return (
    <div className={styles.Navbar}>
      <div className={styles.leftSide_header}>
        <img
          src="https://www.redbus.in/i/59538b35953097248522a65b4b79650e.png"
          alt="logo"
          onClick={() => history.push("/")}
        />
        <ul className={styles.Navbar__listOne}>
          <li>
            <Link to="/">BUS TICKETS</Link>
          </li>
        </ul>
      </div>

      <ul className={styles.Navbar__listTwo}>
        <div className={styles.rightSide_header}>
          <li className={styles.navAction} onClick={handleManageBooking}>
            <ConfirmationNumberIcon style={{ fontSize: "18px" }} />
            <span>MANAGE BOOKING</span>
          </li>
          <li>
            <Tooltip title="Manage trips" arrow>
              <IconButton className={styles.iconButton} onClick={(event) => setAnchorEl(event.currentTarget)}>
                <KeyboardArrowDownIcon className={styles.icons} />
              </IconButton>
            </Tooltip>
            <Menu
              id="manage-booking-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  handleManageBooking();
                }}
              >
                My Trips
              </MenuItem>
            </Menu>
          </li>
          <li>
            <AccountCircleIcon className={styles.accountIcon} />
          </li>
          <li>
            <Tooltip title="Account" arrow>
              <IconButton className={styles.iconButton} onClick={(event) => setAnchorEl2(event.currentTarget)}>
                <KeyboardArrowDownIcon className={styles.icons} />
              </IconButton>
            </Tooltip>

            {isLoggedIn && currentCustomer ? (
              <Menu
                id="account-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={() => setAnchorEl2(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl2(null);
                    history.push("/my-profile");
                  }}
                >
                  My Profile
                </MenuItem>
                {currentCustomer.role === "admin" && (
                  <MenuItem
                    onClick={() => {
                      setAnchorEl2(null);
                      history.push("/admin");
                    }}
                  >
                    Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </Menu>
            ) : (
              <Menu
                id="account-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={() => setAnchorEl2(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl2(null);
                    history.push("/login");
                  }}
                >
                  Login / Register
                </MenuItem>
              </Menu>
            )}
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
