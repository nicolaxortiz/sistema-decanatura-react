import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import "../styles/loginForm.css";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import * as APIdocentes from "../API/TeacherCall.js";
import * as APIcoordinador from "../API/CoordinatorCall.js";
import * as APIcampus from "../API/CampusCall.js";

function RecoveryForm() {
  const navigate = useNavigate();
  const { setUser, user } = React.useContext(UseContext);
  const [message, setMessage] = React.useState();
  const [severity, setSeverity] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const documentInput = React.useRef(null);
  const emailInput = React.useRef(null);

  const handleSubmitLogin = async () => {
    const email = emailInput.current.value;
    setLoading(true);

    if (!!email) {
      try {
        const responseTeacher = await APIdocentes.getTeacherByEmail(email);

        if (responseTeacher.status === 200) {
          setMessage(
            "La nueva contraseña ha sido enviada al correo electrónico"
          );
          setSeverity("success");
          setLoading(false);
          setOpen(true);
        }
      } catch (errorTeacher) {
        if (errorTeacher.response.status === 404) {
          try {
            const responseCoordinator =
              await APIcoordinador.getCoordinatorByEmail(email);
            if (responseCoordinator.status === 200) {
              setMessage(
                "La nueva contraseña ha sido enviada al correo electrónico"
              );
              setSeverity("success");
              setLoading(false);
              setOpen(true);
            }
          } catch (errorCoordinator) {
            if (errorCoordinator.response.status === 404) {
              try {
                const responseCampus = await APIcampus.getCampusByEmail(email);

                if (responseCampus.status === 200) {
                  setMessage(
                    "La nueva contraseña ha sido enviada al correo electrónico"
                  );
                  setSeverity("success");
                  setLoading(false);
                  setOpen(true);
                }
              } catch (error) {
                setMessage("El correo ingresado es incorrecto");
                setSeverity("error");
                setLoading(false);
                setOpen(true);
              }
            }
          }
        } else {
          setMessage("Error: inténtelo mas tarde");
          setSeverity("error");
          setLoading(false);
          setOpen(true);
        }
      }
    } else {
      setMessage("No se admiten campos vacíos");
      setSeverity("error");
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <>
      <div className="infor-box">
        <Grid container rowSpacing={3}>
          <Grid xs={12}>
            <div className="title-info">Información importante</div>
          </Grid>
          <Grid xs={12}>
            <div style={{ fontWeight: 500 }}>
              Estimado usuario, si continua presentando problemas con su
              contraseña acérquese a su correspondiente coordinación para
              realizar la solicitud de revision de su cuenta, ademas tenga en
              cuenta las siguientes observaciones para un correcto uso de sus
              datos:
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - Para el ingreso debe haber sido registrado en la base de datos
              de docentes.
            </div>
          </Grid>

          <Grid xs={12}>
            <div>
              - Para el cambio de contraseña debe revisar su correo electrónico,
              en donde hallara su contraseña temporal.
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - Se recomienda no dejar activa la contraseña temporal, cámbiela
              lo mas pronto posible
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="login-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-login">Recuperación de contraseña</div>
          </Grid>
        </Grid>
        <Grid container rowSpacing={3}>
          <ThemeProvider theme={theme}>
            <Grid xs={12}>
              <Collapse in={open}>
                <Alert
                  severity={severity}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {message}
                </Alert>
              </Collapse>
            </Grid>

            <Grid xs={12}>
              <TextField
                label="Correo electrónico"
                size="small"
                fullWidth
                type="email"
                inputRef={emailInput}
              />
            </Grid>

            <Grid xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                onClick={() => {
                  setOpen(false);
                  handleSubmitLogin();
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Recuperar contraseña"
                )}
              </Button>
            </Grid>
          </ThemeProvider>
          <Grid xs={4}></Grid>
          <Grid xs={8}></Grid>
        </Grid>
      </div>
    </>
  );
}

export default RecoveryForm;
