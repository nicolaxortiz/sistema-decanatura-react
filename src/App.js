import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UseContext } from "./context/UseContext.js";
import States from "./hooks/states.js";
import { Login } from "./views/Login.jsx";
import { Home } from "./views/Home.jsx";
import Activity from "./views/Activity.jsx";
import Products from "./views/Products.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import Schedule from "./views/Schedule.jsx";
import Finish from "./views/Finish.jsx";
import ForgotPassword from "./views/ForgotPassword.jsx";
import ChangePassword from "./views/ChangePassword.jsx";
import Coordinator from "./views/Coordinator.jsx";
import Admin from "./views/Admin.jsx";

function App() {
  const initial = States();
  return (
    <UseContext.Provider value={initial}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/recovery" element={<ForgotPassword />} />
            <Route path="/change" element={<ChangePassword />} />
            <Route path="/coordinator" element={<Coordinator />} />
            <Route path="/home" element={<Home />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/product" element={<Products />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/finish" element={<Finish />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </UseContext.Provider>
  );
}

export default App;
