import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import logoUTS from "../resources/UTSescudo.jpg";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import * as APIDocument from "../API/DocumentCall.js";
import * as APIFormat from "../API/FormatCall.js";
import { UseContext } from "../context/UseContext.js";
import { Misionales } from "../resources/bucaramanga.js";

export default function CoordinatorHome() {
  const { user, configuration, setSesionInvalid } =
    React.useContext(UseContext);
  const [mission, setMission] = React.useState(null);
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

  const handleFinalPDF = async () => {
    try {
      let response = await APIDocument.getReporte(
        user?.program_id,
        configuration?.semester,
        configuration?.title
      );

      if (response.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const pdfFileName = `${configuration.title}.pdf`;

        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFileName;
        a.click();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error?.response?.status === 404) {
        setMessage("No hay actividades para generar el PDF");
        setCode("warning");
        handleClick();
      } else {
        setMessage("Error al generar el PDF, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleFormatMissionPDF = async (data) => {
    if (mission === null) {
      setMessage("Debe seleccionar una misional primero");
      setCode("warning");
      handleClick();
      return;
    }

    try {
      const searchResponse = await APIFormat.getByProgramIdAndSemester(
        user?.program_id,
        configuration?.semester,
        null,
        null,
        true
      );

      if (searchResponse.status === 200) {
        let newMission = "";
        if (mission === "Otras") {
          newMission = "Otros";
        } else {
          newMission = mission;
        }

        searchResponse.data.format.forEach(async (element) => {
          try {
            const response = await APIDocument.getDocumentByMission(
              configuration?.semester,
              element.teacher_id,
              newMission
            );

            if (response.status === 200) {
              const blob = response.data;
              const url = window.URL.createObjectURL(blob);

              const pdfFileName = `F-DC-54-${element?.first_name}-${element?.last_name}-Semestre${configuration?.semester}.pdf`;

              const a = document.createElement("a");
              a.href = url;
              a.download = pdfFileName;
              a.click();
            }
          } catch (error) {
            if (error.response.status === 401) {
              setSesionInvalid(true);
            } else {
              setMessage("Aún no ha registrado una firma en la configuración");
              setCode("error");
              handleClick();
            }
          }
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      }
    }
  };

  const handleMissionPDF = async () => {
    if (mission === null) {
      setMessage("Debe seleccionar una misional primero");
      setCode("warning");
      handleClick();
      return;
    }

    try {
      const response = await APIDocument.getReporteByMission(
        user?.program_id,
        configuration?.semester,
        mission,
        configuration?.title
      );

      if (response?.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const pdfFileName = `${configuration.title}-${mission}.pdf`;

        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFileName;
        a.click();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error?.response.status === 404) {
        setMessage("No hay actividades para generar el PDF");
        setCode("warning");
        handleClick();
      } else {
        setMessage("Error al generar el PDF, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  return (
    <>
      <div className="finish-box">
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid xs={12}>
            <div className="title-finish">
              Distribución de la actividad docente
            </div>
          </Grid>

          <Grid xs={12} className="img-box">
            <img src={logoUTS} alt="logo uts" className="imgLogoUTS" />
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish">
              A continuación se puede realizar la descarga del formato de
              distribución de las actividades de los docentes que han realizado
              el adecuado registro.
            </div>
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish" style={{ marginBottom: 10 }}>
              - Unidades Tecnológicas de Santander ¡Lo hacemos posible!
            </div>
          </Grid>

          <ThemeProvider theme={theme}>
            <Grid xs={4} style={{ marginBottom: 5 }}>
              <Autocomplete
                disablePortal
                options={Misionales}
                value={mission}
                onChange={(event, newValue) => {
                  setMission(newValue);
                }}
                size="small"
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Misional" />
                )}
              />
            </Grid>

            <Grid xs={4} style={{ marginBottom: 5 }}>
              <Button
                variant="contained"
                color="search"
                fullWidth
                onClick={() => {
                  handleMissionPDF();
                }}
              >
                Acumulado por misional
              </Button>
            </Grid>

            <Grid xs={4} style={{ marginBottom: 5 }}>
              <Button
                variant="contained"
                color="search"
                fullWidth
                onClick={() => {
                  handleFormatMissionPDF();
                }}
              >
                F-DC-54 por misional
              </Button>
            </Grid>

            <Grid xs={12} style={{ marginBottom: 10 }}>
              <Button
                variant="contained"
                color="pdf"
                fullWidth
                onClick={() => {
                  handleFinalPDF();
                }}
              >
                Generar formato acumulado
              </Button>
            </Grid>
          </ThemeProvider>
        </Grid>
      </div>

      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
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
