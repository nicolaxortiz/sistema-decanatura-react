import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import logoUTS from "../resources/logo.png";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import * as APIDocument from "../API/DocumentCall.js";
import * as APIFormat from "../API/FormatCall.js";
import * as APIprogram from "../API/ProgramCall.js";
import { UseContext } from "../context/UseContext.js";
import * as camposBucaramanga from "../resources/bucaramanga.js";
import * as camposVelez from "../resources/vélez.js";
import * as camposBarrancabermeja from "../resources/barrancabermeja.js";
import * as camposPiedecuesta from "../resources/piedecuesta.js";
import * as camposVirtual from "../resources/virtual.js";

export default function DeanHome() {
  const { user, configuration, setSesionInvalid } =
    React.useContext(UseContext);
  const [mission, setMission] = React.useState(null);
  const [program, setProgram] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [campos, setCampos] = React.useState(null);
  const [programData, setProgramData] = React.useState([]);

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
        program.id,
        configuration?.semester,
        configuration?.title
      );

      if (response.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const pdfFileName = `${configuration.title} - ${program.name}.pdf`;

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

  const handleFormatMissionPDF = async () => {
    try {
      const searchResponse = await APIFormat.getByProgramIdAndSemester(
        program.id,
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
        const zipFileName = `F-DC-54 - Semestre ${configuration?.semester} - ${program.name} - ${newMission}.zip`;
        saveAs(zipBlob, zipFileName);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSesionInvalid(true);
      } else {
        setMessage("No se encontraron formatos para descargar");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleMissionPDF = async () => {
    try {
      const response = await APIDocument.getReporteByMission(
        program.id,
        configuration?.semester,
        mission,
        configuration?.title
      );

      if (response?.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const pdfFileName = `${configuration.title} - ${program.name} - ${mission}.pdf`;

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

  const fetchProgramsData = async () => {
    try {
      const response = await APIprogram.getByFacultyAndCampusId(
        user?.campus_id,
        user?.faculty
      );
      if (response.status === 200) {
        setProgramData(response.data.programs);
      }
    } catch (error) {
      setProgramData([]);
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron programas");
        setCode("error");
        handleClick();
      } else {
        handleClose();
        setMessage("Error al traer los datos, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchProgramsData();
    }
  }, [user]);

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
            <Grid xs={6} style={{ marginBottom: 5 }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                disabled={!programData}
                options={programData}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={program}
                onChange={(event, newValue) => setProgram(newValue)}
                size="small"
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Programa" />
                )}
              />
            </Grid>

            <Grid xs={6} style={{ marginBottom: 5 }}>
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

            <Grid xs={6} style={{ marginBottom: 5 }}>
              <Button
                variant="contained"
                color="search"
                fullWidth
                disabled={!program || !mission}
                onClick={() => {
                  handleMissionPDF();
                }}
              >
                Acumulado por misional
              </Button>
            </Grid>

            <Grid xs={6} style={{ marginBottom: 5 }}>
              <Button
                variant="contained"
                color="search"
                fullWidth
                disabled={!program || !mission}
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
                disabled={!program}
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
