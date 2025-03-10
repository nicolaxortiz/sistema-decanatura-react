import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import "../styles/loginForm.css";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import * as APIdocentes from "../API/TeacherCall.js";
import * as APIcoordinador from "../API/CoordinatorCall.js";
import * as APIConfiguracion from "../API/ConfigurationCall.js";
import * as APIcampus from "../API/CampusCall.js";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser, user, setConfiguration } = React.useContext(UseContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const emailInput = React.useRef(null);
  const passwordInput = React.useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmitLogin = async () => {
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    setLoading(true);

    if (!!email && !!password) {
      try {
        const response = await APIdocentes.getTeacherByCredentials(
          email,
          password
        );

        if (response.status === 200) {
          handleSetUser(response.data.teacher);
        }
      } catch (errorTeacher) {
        if (errorTeacher.response.status === 404) {
          try {
            const responseCoordinator = await APIcoordinador.getByCredential(
              email,
              password
            );

            if (responseCoordinator.status === 200) {
              handleSetUser(responseCoordinator.data.coordinator);
            }
          } catch (errorCoordinator) {
            if (errorCoordinator.response.status === 404) {
              try {
                const responseCampus = await APIcampus.getByCredential(
                  email,
                  password
                );

                if (responseCampus.status === 200) {
                  handleSetUser(responseCampus.data.campus);
                }
              } catch (errorCampus) {
                if (errorCampus.response.status === 404) {
                  setMessage("Los datos ingresados son incorrectos");
                  setLoading(false);
                  setOpen(true);
                }
              }
            }
          }
        } else if (errorTeacher.response.status === 401) {
          setMessage("Docente inactivo, comuníquese con su coordinación");

          setLoading(false);
          setOpen(true);
        } else if (errorTeacher.response.status === 500) {
          setMessage("Error: inténtelo mas tarde");

          setLoading(false);
          setOpen(true);
        }
      }
    } else {
      setOpen(true);
      setMessage("No se admiten campos vacíos");
      setLoading(false);
    }
  };

  const handleSetUser = (user) => {
    const stringUser = JSON.stringify(user);
    localStorage.setItem("User", stringUser);
    setUser(user);

    if (user.role && user.role === "campus") {
      handleConfigurationByCampusId(user.id);
    } else if (user.role && user.role === "coordinator") {
      handleConfigurationByProgramId(user.program_id, "coordinator");
    } else {
      handleConfigurationByProgramId(user.program_id, "teacher");
    }
  };

  const handleConfigurationByCampusId = async (campus_id) => {
    const response = await APIConfiguracion.getByIdCampus(campus_id);

    if (response.status === 200) {
      const actualConfiguration = response.data.configurations;
      const StringConfiguration = JSON.stringify(actualConfiguration);
      localStorage.setItem("Configuration", StringConfiguration);
      setConfiguration(actualConfiguration);
      setLoading(false);
      navigate("/admin");
    }
  };

  const handleConfigurationByProgramId = async (program_id, role) => {
    const response = await APIConfiguracion.getByIdProgram(program_id);

    if (response.status === 200) {
      const actualConfiguration = response.data.configurations;
      const StringConfiguration = JSON.stringify(actualConfiguration);
      localStorage.setItem("Configuration", StringConfiguration);
      setConfiguration(actualConfiguration);
      setLoading(false);
      if (role === "coordinator") {
        navigate("/coordinator");
      } else {
        navigate("/home");
      }
    }
  };

  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    const confDataStr = localStorage.getItem("Configuration");
    const confData = JSON.parse(confDataStr);

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
        setConfiguration();
      } else if (data?.role === "coordinator") {
        setUser(data);
        setConfiguration(confData);
        navigate("/coordinator");
      } else {
        navigate("/home");
      }
    }
  }, []);

  return (
    <>
      <div className="login-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-login">Inicio de sesión</div>
          </Grid>
        </Grid>
        <Grid container rowSpacing={3}>
          <ThemeProvider theme={theme}>
            <Grid xs={12}>
              <Collapse in={open}>
                <Alert
                  severity="error"
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
                label="Email"
                size="small"
                fullWidth
                inputRef={emailInput}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                label="Contraseña"
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
              <div
                className="txt-contra"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/recovery");
                  setUser({ role: "recovery" });
                }}
              >
                Olvide mi contraseña
              </div>
            </Grid>

            <Grid xs={12}>
              <Button
                variant="contained"
                disabled={loading}
                fullWidth
                onClick={() => {
                  setOpen(false);
                  handleSubmitLogin();
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Iniciar sesión"
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
};
