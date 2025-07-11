import React from "react";
import "../styles/loginForm.css";
import Grid from "@mui/material/Unstable_Grid2";
import {
  TextField,
  Button,
  Collapse,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import * as APIdocentes from "../API/TeacherCall.js";
import * as APIcoordinador from "../API/CoordinatorCall.js";
import * as APIdean from "../API/DeanCall.js";
import * as APIcampus from "../API/CampusCall.js";

function ChangeForm() {
  const [severity, setSeverity] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openCollapse, setOpenCollapse] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const passwordInput = React.useRef(null);
  const confirmInput = React.useRef(null);
  const firstPasswordInput = React.useRef(null);
  const emailInput = React.useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmitLogin = async () => {
    const email = emailInput.current.value;
    const firstPassword = firstPasswordInput.current.value;
    const password = passwordInput.current.value;
    const confirm = confirmInput.current.value;

    if (!!password && !!confirm && !!email && !!firstPassword) {
      if (password === confirm) {
        try {
          const responseTeacher = await APIdocentes.getTeacherByCredentials(
            email,
            firstPassword
          );

          if (responseTeacher.status === 200) {
            try {
              const changeResponse = await APIdocentes.updateTeacher(
                responseTeacher.data.teacher.id,
                { password: password }
              );

              if (changeResponse.status === 200) {
                setSeverity("success");
                setMessage("Contraseña actualizada correctamente");
                setLoading(false);
                setOpenCollapse(true);
              }
            } catch (error) {
              setLoading(false);
              setSeverity("error");
              setMessage("Error: inténtelo mas tarde");
              setOpenCollapse(true);
            }
          }
        } catch (errorTeacher) {
          if (errorTeacher.response.status === 404) {
            try {
              const responseCoordinator = await APIcoordinador.getByCredential(
                email,
                firstPassword
              );

              if (responseCoordinator.status === 200) {
                try {
                  const changeResponse = await APIcoordinador.updateCoordinator(
                    responseCoordinator.data.coordinator.id,
                    { password: password }
                  );

                  if (changeResponse.status === 200) {
                    setSeverity("success");
                    setMessage("Contraseña actualizada correctamente");
                    setLoading(false);
                    setOpenCollapse(true);
                  }
                } catch (error) {
                  setLoading(false);
                  setSeverity("error");
                  setMessage("Error: inténtelo mas tarde");
                  setOpenCollapse(true);
                }
              }
            } catch (errorCoordinator) {
              if (errorCoordinator.response.status === 404) {
                try {
                  const responseDean = await APIdean.getByCredential(
                    email,
                    firstPassword
                  );

                  if (responseDean.status === 200) {
                    try {
                      const changeResponse = await APIdean.updateDean(
                        responseDean.data.dean.id,
                        { password: password }
                      );

                      if (changeResponse.status === 200) {
                        setSeverity("success");
                        setMessage("Contraseña actualizada correctamente");
                        setLoading(false);
                        setOpenCollapse(true);
                      }
                    } catch (error) {
                      setLoading(false);
                      setSeverity("error");
                      setMessage("Error: inténtelo mas tarde");
                      setOpenCollapse(true);
                    }
                  }
                } catch (errorDean) {
                  if (errorDean.response.status === 404) {
                    try {
                      const responseCampus = await APIcampus.getByCredential(
                        email,
                        firstPassword
                      );

                      if (responseCampus.status === 200) {
                        try {
                          const changeResponse = await APIcampus.updateCampus(
                            responseCampus.data.campus.id,
                            { password: password }
                          );

                          if (changeResponse.status === 200) {
                            setSeverity("success");
                            setMessage("Contraseña actualizada correctamente");
                            setLoading(false);
                            setOpenCollapse(true);
                          }
                        } catch (error) {
                          setLoading(false);
                          setSeverity("error");
                          setMessage("Error: inténtelo mas tarde");
                          setOpenCollapse(true);
                        }
                      }
                    } catch (errorCampus) {
                      if (errorCampus.response.status === 404) {
                        setLoading(false);
                        setSeverity("error");
                        setMessage("Los datos ingresados son incorrectos");
                        setOpenCollapse(true);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        setLoading(false);
        setSeverity("error");
        setMessage("La confirmación de la nueva contraseña no coincide");
        setOpenCollapse(true);
      }
    } else {
      setLoading(false);
      setSeverity("error");
      setMessage("No se admiten campos vacíos");
      setOpenCollapse(true);
    }
  };

  return (
    <>
      <div className="infor-box">
        <Grid container rowSpacing={2}>
          <Grid xs={12}>
            <div className="title-info">Información importante</div>
          </Grid>
          <Grid xs={12}>
            <div style={{ fontWeight: 500 }}>
              Estimado usuario, en caso de persistir problemas con la
              contraseña, se solicita acudir a la coordinación correspondiente
              para gestionar la revisión de la cuenta. Asimismo, se recomienda
              considerar las siguientes indicaciones para el correcto uso de las
              credenciales:
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - Es requisito indispensable estar registrado en la base de datos
              de docentes para poder acceder al sistema.
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - La contraseña debe cumplir con los siguientes requisitos:
              contener al menos un número, una letra mayúscula y un mínimo de 8
              caracteres.
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - Se aconseja evitar el uso de información personal como
              contraseña.
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="login-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-login">Nueva contraseña</div>
          </Grid>
        </Grid>
        <Grid container rowSpacing={3}>
          <ThemeProvider theme={theme}>
            <Grid xs={12}>
              <Collapse in={openCollapse}>
                <Alert
                  severity={severity}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenCollapse(false);
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
              <TextField
                label="Contraseña anterior"
                size="small"
                fullWidth
                type="password"
                inputRef={firstPasswordInput}
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                label="Contraseña nueva"
                size="small"
                fullWidth
                type={showPassword ? "text" : "password"}
                inputRef={passwordInput}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {!showPassword && (
                        <VisibilityIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleClickShowPassword();
                          }}
                        />
                      )}
                      {showPassword && (
                        <VisibilityOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleClickShowPassword();
                          }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                label="Confirme su contraseña"
                size="small"
                fullWidth
                type={showPassword ? "text" : "password"}
                inputRef={confirmInput}
              />
            </Grid>

            <Grid xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                onClick={() => {
                  setOpenCollapse(false);
                  handleSubmitLogin();
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Guardar contraseña"
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

export default ChangeForm;
