import React from "react";
import "../styles/header.css";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
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
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/EW3htLVSdMBLqhDt4f8M0PIBVx-I4x2VgswTKUHG7P6EHg?e=lMLVPz",
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
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/ERbF1-aGbQBNmERiFFpXTlkBSeyhHvG3cffADWus2RMB-w?e=43QHTY",
                        "_blank"
                      );
                    }}
                  >
                    Manual coordinador
                  </Button>
                )}

                {user?.role === "teacher" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      window.open(
                        "https://unidadestecno-my.sharepoint.com/:b:/g/personal/nsortiz_uts_edu_co/EVZPNqS2DetEh_fP9Ntfpg4Bc2k_okQVOzYxEQTnWG2sjg?e=2fQ9Ne",
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
