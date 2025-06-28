import React from "react";
import "../styles/header.css";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, ThemeProvider } from "@mui/material";
import { theme } from "../resources/theme.js";
import logoimg from "../resources/logo.png";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const {
    setUser,
    user,
    setActivities,
    setDataSchedule,
    setConfiguration,
    setOption,
    setTab,
  } = React.useContext(UseContext);
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    handleEditUser();

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
      }
    }
  }, [user]);

  const handleEditUser = () => {
    const dataStr = localStorage.getItem("UserEdit");
    const data = JSON.parse(dataStr);

    if (data) {
      setRole("userEdit");
    }
  };

  const handleLogout = () => {
    const dataStr = localStorage.getItem("UserEdit");
    const data = JSON.parse(dataStr);

    if (!data) {
      localStorage.removeItem("User");
      localStorage.removeItem("Activity");
      localStorage.removeItem("Schedule");
      localStorage.removeItem("Configuration");
      localStorage.removeItem("Token");
      setUser();
      setActivities();
      setDataSchedule();
      setConfiguration();
      setRole(null);
      setOption(1);
      setTab(1);
    } else {
      localStorage.removeItem("UserEdit");
      localStorage.removeItem("Activity");
      localStorage.removeItem("Schedule");
      localStorage.setItem("User", dataStr);
      setUser(data);
      setRole(null);
      setOption(1);
      setTab(1);
      navigate("/coordinator");
    }
  };
  return (
    <>
      <Grid container className="header-box">
        <Grid xs={6} sm={6} md={6} lg={8}>
          <img src={logoimg} alt="logo" className="logo-img" />
        </Grid>

        <Grid xs={6} sm={6} md={6} lg={4}>
          <Grid
            container
            rowGap={1}
            columnGap={1}
            sx={{ justifyContent: "flex-end" }}
          >
            <Grid xs={6} sm={6} md={6} lg={6}>
              <ThemeProvider theme={theme}>
                {user?.role === "campus" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      window.open(
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/EVVuVaCDutdNr8ZIVlx1nXYBgKMT1hL_IqxgS1A8vldfVw?e=fzxdS2",
                        "_blank"
                      );
                    }}
                  >
                    Manual campus
                  </Button>
                )}

                {user?.role === "coordinator" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      window.open(
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/EVw3duZXlIFFqj1oiVwBgwsBwLPf2jBXGU6o72Tl8P-L2w?e=o9vPCN",
                        "_blank"
                      );
                    }}
                  >
                    Manual coordinador
                  </Button>
                )}

                {user?.role === "dean" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      window.open(
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/EZOUvAQ3rR1KrUsdZCTxO3QBJve6MX4HPfU1c3AcaALU0A?e=DENPqK",
                        "_blank"
                      );
                    }}
                  >
                    Manual decano
                  </Button>
                )}

                {user?.role === "teacher" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      window.open(
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/EWrClYRJOD9MutpLlJpM6AoBZnPPf2VAQ9g_Mcc2AhDY7A?e=CeJNm6",
                        "_blank"
                      );
                    }}
                  >
                    Manual docente
                  </Button>
                )}
              </ThemeProvider>
            </Grid>

            <Grid xs={6} sm={6} md={6} lg={6}>
              {!!user ? (
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    {(user?.role === "changePassword" ||
                      user?.role === "recovery") &&
                      "Iniciar sesión"}

                    {user?.role === "campus" && "Cerrar sesión"}
                    {user?.role === "coordinator" && "Cerrar sesión"}
                    {user?.role === "dean" && "Cerrar sesión"}
                    {user?.role === "teacher" &&
                      role === null &&
                      "Cerrar sesión"}
                    {role === "userEdit" && "Volver a portal coordinador"}
                  </Button>
                </ThemeProvider>
              ) : (
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setUser({ role: "changePassword" });
                      navigate("/change");
                    }}
                  >
                    Actualizar contraseña
                  </Button>
                </ThemeProvider>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
