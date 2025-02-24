import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import logoUTS from "../resources/UTSescudo.jpg";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as APIDocument from "../API/DocumentCall.js";
import * as APITeacher from "../API/TeacherCall.js";

function AdminDocument() {
  const [documento, setDocumento] = React.useState("");
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

  const handlePDF = async () => {
    try {
      const response = await APIDocument.getReporte();

      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      setMessage("Error al generar el PDF, intentelo nuevamente");
      setCode("error");
      handleClick();
    }
  };

  const handleTeacherPDF = async () => {
    if (documento !== "") {
      try {
        const response = await APITeacher.getByDocument(documento);
        if (response.status === 200) {
          try {
            const responseDocument = await APIDocument.getDocument(
              response.data.teachers[0]._id
            );
            if (responseDocument.status === 200) {
              window.open(responseDocument.config.url, "_blank");
            }
          } catch (error) {
            setMessage("Error al generar el PDF, intentelo nuevamente");
            setCode("error");
            handleClick();
          }
        }
      } catch (error) {
        setMessage(
          "Error al generar el PDF: no existe un docente con ese documento"
        );
        setCode("error");
        handleClick();
      }
    }
  };
  return (
    <>
      <div className="finish-box">
        <Grid container rowSpacing={2} columnSpacing={1}>
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
            <div className="subtitle-finish">
              En el caso de la falta de datos e información comuníquese con la
              facultad pertinente y con el docente que se requiera.
            </div>
          </Grid>

          <Grid xs={12}>
            <div className="subtitle-finish" style={{ marginBottom: 10 }}>
              - Unidades Tecnológicas de Santander ¡Lo hacemos posible!
            </div>
          </Grid>

          <ThemeProvider theme={theme}>
            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Documento"
                size="small"
                fullWidth
                rows={4}
                maxRows={4}
                name="documento"
                value={documento}
                onChange={(event) => {
                  setDocumento(event.target.value);
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6} style={{ marginBottom: 10 }}>
              <Button
                variant="contained"
                color="search"
                fullWidth
                onClick={() => {
                  handleTeacherPDF();
                }}
              >
                Buscar y generar PDF docente
              </Button>
            </Grid>

            <Grid xs={12} style={{ marginBottom: 10 }}>
              <Button
                variant="contained"
                color="pdf"
                fullWidth
                onClick={() => {
                  handlePDF();
                }}
              >
                Generar formato PDF acumulado
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

export default AdminDocument;
