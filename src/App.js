import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UseContext } from "./context/UseContext.js";
import States from "./hooks/states.js";
import { Login } from "./views/Login.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import ForgotPassword from "./views/ForgotPassword.jsx";
import ChangePassword from "./views/ChangePassword.jsx";
import Coordinator from "./views/Coordinator.jsx";
import Admin from "./views/Admin.jsx";
import Teacher from "./views/Teacher.jsx";
import Dean from "./views/Dean.jsx";

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
            <Route path="/dean" element={<Dean />} />
            <Route path="/coordinator" element={<Coordinator />} />
            <Route path="/home" element={<Teacher />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </UseContext.Provider>
  );
}

export default App;
