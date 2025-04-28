import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import logoUTS from "../resources/UTSescudo.jpg";
import { UseContext } from "../context/UseContext.js";
import * as APIDocument from "../API/DocumentCall.js";
import { useNavigate } from "react-router-dom";
import "../styles/finishForm.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function FinishForm() {
  const navigate = useNavigate();
  const {
    user,
    setActivities,
    setUser,
    setDataSchedule,
    setConfiguration,
    configuration,
    setOption,
    setSesionInvalid,
    setTab,
  } = React.useContext(UseContext);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [role, setRole] = React.useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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

  const handlePDF = async () => {
    try {
      const response = await APIDocument.getDocument(
        configuration?.semester,
        user?.id
      );

      if (response.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const pdfFileName = `F-DC-54-${user?.first_name}-${user?.last_name}-Semestre${configuration?.semester}.pdf`;

        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFileName;
        a.click();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSesionInvalid(true);
      } else {
        setMessage("Error al generar el PDF, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  React.useEffect(() => {
    const dataStr = localStorage.getItem("UserEdit");
    const data = JSON.parse(dataStr);

    if (data) {
      setRole("coordinator");
    } else {
      setRole("teacher");
    }
  }, []);
  return (
    <>
      <div className="finish-box">
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid xs={12}>
            <div className="title-finish">Ha finalizado el registro</div>
          </Grid>

          <Grid xs={12} className="img-box">
            <img src={logoUTS} alt="logo uts" className="imgLogoUTS" />
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish">
              El formato F-DC-54 ha sido guardado correctamente y sera revisado
              por la coordinación correspondiente.
            </div>
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish">
              Gracias por cumplir con sus responsabilidades como docente.
              Recordamos que completar sus deberes nos ayuda a mejorar y a
              cumplir con las expectativas de la comunidad.
            </div>
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish" style={{ marginBottom: 10 }}>
              - Unidades Tecnológicas de Santander ¡Lo hacemos posible!
            </div>
          </Grid>

          <ThemeProvider theme={theme}>
            <Grid xs={12} sm={6} md={6} lg={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  handleLogout();
                }}
              >
                {role === "coordinator"
                  ? "Volver a portal coordinador"
                  : "Cerrar sesión"}
              </Button>
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6} style={{ marginBottom: 10 }}>
              <Button
                variant="contained"
                color="pdf"
                fullWidth
                onClick={() => {
                  handlePDF();
                }}
              >
                Guardar formato PDF
              </Button>
            </Grid>
          </ThemeProvider>
        </Grid>
      </div>

      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleClose}
          severity={code}
          variant="outlined"
          sx={{ width: "100%", backgroundColor: "white" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FinishForm;
