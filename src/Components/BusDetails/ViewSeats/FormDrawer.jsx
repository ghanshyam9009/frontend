import React from "react";
import Drawer from "@material-ui/core/Drawer";
import styles from "./FormDrawer.module.css";
import BusBookingForm from "../../Bus Booking Form/BusBookingForm";

export function FormDrawer() {
  const [formDrawerState, setFormDrawerState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setFormDrawerState(open);
  };

  return (
    <React.Fragment>
      <button onClick={toggleDrawer(true)} className={styles.proceedButton}>
        Proceed To Book
      </button>
      <Drawer anchor="right" open={formDrawerState} onClose={toggleDrawer(false)}>
        <div style={{ width: "600px" }}>
          <BusBookingForm />
        </div>
      </Drawer>
    </React.Fragment>
  );
}
