import React from "react";
import "../styles/header.css";
import Grid from "@mui/material/Unstable_Grid2";
import logoimg from "../resources/logo.png";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { setUser, user, setActividades } = React.useContext(UseContext);

  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Activity");
    localStorage.removeItem("Schedule");
    setUser();
    setActividades();
  };
  return (
    <>
      <Grid container className="header-box">
        <Grid xs={10} sm={8} md={6} lg={4}>
          <img src={logoimg} alt="logo" className="logo-img" />
        </Grid>
        <Grid xs={2} sm={4} md={6} lg={8}></Grid>
      </Grid>
      <Grid container className="info-box">
        <Grid xs={12}>
          {!!user ? (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleLogout();
              }}
            >
              {user?.role === "changePassword" || user?.role === "recovery"
                ? "Iniciar sesion"
                : "Cerrar sesión"}
            </div>
          ) : (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setUser({ role: "changePassword" });
                navigate("/change");
              }}
            >
              Actualizar contraseña
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}
