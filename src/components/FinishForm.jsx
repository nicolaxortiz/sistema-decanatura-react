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
  const { user, actividades, setActividades, setUser, dataSchedule } =
    React.useContext(UseContext);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");

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
    localStorage.removeItem("User");
    localStorage.removeItem("Activity");
    localStorage.removeItem("Schedule");
    setUser();
    setActividades();
  };

  const handlePDF = async () => {
    try {
      const response = await APIDocument.getDocument(user?._id);

      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      setMessage("Error al generar el PDF, intentelo nuevamente");
      setCode("error");
      handleClick();
    }
  };
  return (
    <>
      <div className="finish-box">
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid xs={12}>
            <div className="title-finish">Haz finalizado el registro</div>
          </Grid>

          <Grid xs={12} className="img-box">
            <img src={logoUTS} alt="logo uts" className="imgLogoUTS" />
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish">
              El formato F-DC-54 ha sido guardado correctamente y toda la
              informacion sera enviada a la oficina de decanatura.
            </div>
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish">
              Gracias por cumplir con tus responsabilidades como docente,
              recuerda que completar tus deberes nos ayuda a ser mejores y a
              cumplir con las expectativas de la comunidad.
            </div>
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish" style={{ marginBottom: 10 }}>
              - Unidades Tecnologicas de Santander ¡Lo hacemos posible!
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
                Cerrar sesión
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

      <Snackbar open={open} onClose={handleClose} autoHideDuration={6000}>
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
