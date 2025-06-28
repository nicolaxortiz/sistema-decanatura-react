import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Grid from "@mui/material/Unstable_Grid2";
import {
  ThemeProvider,
  Button,
  Snackbar,
  Alert,
  TextField,
  Autocomplete,
} from "@mui/material";
import { theme } from "../resources/theme.js";
import logoUTS from "../resources/logo.png";
import { UseContext } from "../context/UseContext.js";
import * as APIDocument from "../API/DocumentCall.js";
import * as APIFormat from "../API/FormatCall.js";
import * as camposBucaramanga from "../resources/bucaramanga.js";
import * as camposVelez from "../resources/vélez.js";
import * as camposBarrancabermeja from "../resources/barrancabermeja.js";
import * as camposPiedecuesta from "../resources/piedecuesta.js";
import * as camposVirtual from "../resources/virtual.js";

export default function CoordinatorHome() {
  const { user, configuration, setSesionInvalid } =
    React.useContext(UseContext);
  const [mission, setMission] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [campos, setCampos] = React.useState(null);

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
        if (mission === "Docencia") {
          newMission = "Docencia directa";
        } else if (mission === "ODA") {
          newMission = "Procesos ODA";
        } else if (mission === "OACA") {
          newMission = "Procesos OACA";
        } else {
          newMission = mission;
        }

        const pdfFiles = [];

        await Promise.all(
          searchResponse.data.format.map(async (element) => {
            try {
              const response = await APIDocument.getDocumentByMission(
                configuration?.semester,
                element.teacher_id,
                newMission
              );

              if (response.status === 200) {
                const blob = response.data;
                const pdfFileName = `F-DC-54 - ${element?.first_name} ${element?.last_name} - Semestre ${configuration?.semester}.pdf`;
                pdfFiles.push({ blob, fileName: pdfFileName });
              }
            } catch (error) {
              if (error.response?.status === 401) {
                setSesionInvalid(true);
              } else {
                setMessage(
                  "Aún no ha registrado una firma en la configuración"
                );
                setCode("error");
                handleClick();
              }
            }
          })
        );

        if (pdfFiles.length === 0) {
          setMessage("No se generaron PDFs para descargar");
          setCode("error");
          handleClick();
          return;
        }

        const zip = new JSZip();
        pdfFiles.forEach(({ blob, fileName }) => {
          zip.file(fileName, blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFileName = `F-DC-54 - Semestre ${configuration?.semester} - ${newMission}.zip`;
        saveAs(zipBlob, zipFileName);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSesionInvalid(true);
      } else {
        setMessage("No se encontraron formatos firmados para descargar");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleMissionPDF = async () => {
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

        const pdfFileName = `${configuration.title} - ${mission}.pdf`;

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

  React.useEffect(() => {
    if (configuration?.information === "bucaramanga.js") {
      setCampos(camposBucaramanga);
    } else if (configuration?.information === "vélez.js") {
      setCampos(camposVelez);
    } else if (configuration?.information === "piedecuesta.js") {
      setCampos(camposPiedecuesta);
    } else if (configuration?.information === "barrancabermeja.js") {
      setCampos(camposBarrancabermeja);
    } else if (configuration?.information === "virtual.js") {
      setCampos(camposVirtual);
    }
  }, [configuration]);

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
                disabled={!campos}
                options={campos?.Misionales}
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
                disabled={!mission}
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
                disabled={!mission}
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
                disabled={!campos}
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
