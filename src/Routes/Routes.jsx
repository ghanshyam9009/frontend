import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SelectBus from "../Components/SelectBus/SelectBus";
import Error from "../Components/Error/Error";
import Profile from "../Components/Profile Page/Profile";
import Payment from "../Components/Payment Page/Payment";
import BusBookingForm from "../Components/Bus Booking Form/BusBookingForm";
import LandingPage from "../Components/LandingPage/LandingPage";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import AuthPage from "../Elements/AuthPage";

const Routes = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <LandingPage />
        </Route>

        <Route path="/login" exact>
          <AuthPage mode="login" />
        </Route>

        <Route path="/register" exact>
          <AuthPage mode="register" />
        </Route>

        <Route
          path="/auth/:mode?"
          exact
          render={({ match }) => (
            <Redirect to={match?.params?.mode === "register" ? "/register" : "/login"} />
          )}
        />

        <Route path="/select-bus" exact>
          <SelectBus />
        </Route>
        <Route path="/my-profile" exact>
          <Profile />
        </Route>
        <Route path="/payment-page" exact>
          <Payment />
        </Route>
        <Route path="/booking-form" exact>
          <BusBookingForm />
        </Route>
        <Route path="/admin" exact>
          <AdminDashboard />
        </Route>
        <Route>
          <Error />
        </Route>
      </Switch>
    </>
  );
};

export default Routes;

