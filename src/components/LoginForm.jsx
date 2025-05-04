import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import "../styles/loginForm.css";
import Grid from "@mui/material/Unstable_Grid2";
import {
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
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
          handleSetUser(response.data.teacher, response.data.token);
        }
      } catch (errorTeacher) {
        if (errorTeacher?.response?.status === 404) {
          try {
            const responseCoordinator = await APIcoordinador.getByCredential(
              email,
              password
            );

            if (responseCoordinator.status === 200) {
              handleSetUser(
                responseCoordinator.data.coordinator,
                responseCoordinator.data.token
              );
            }
          } catch (errorCoordinator) {
            if (errorCoordinator?.response?.status === 404) {
              try {
                const responseCampus = await APIcampus.getByCredential(
                  email,
                  password
                );

                if (responseCampus.status === 200) {
                  handleSetUser(
                    responseCampus.data.campus,
                    responseCampus.data.token
                  );
                }
              } catch (errorCampus) {
                if (errorCampus?.response?.status === 404) {
                  setMessage("Los datos ingresados son incorrectos");
                  setLoading(false);
                  setOpen(true);
                }
              }
            }
          }
        } else if (errorTeacher?.response?.status === 401) {
          setMessage("Docente inactivo, comuníquese con su coordinación");
          setLoading(false);
          setOpen(true);
        } else if (errorTeacher?.response?.status === 500) {
          setMessage("Error: inténtelo mas tarde");
          setLoading(false);
          setOpen(true);
        } else {
          setMessage("Error de servidor: inténtelo mas tarde");
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

  const handleSetUser = (userData, userToken) => {
    localStorage.setItem("Token", userToken);
    setUser(userData);

    if (userData.role && userData.role === "campus") {
      handleConfigurationByCampusId(userData);
    } else if (userData.role && userData.role === "coordinator") {
      handleConfigurationByProgramId(userData, "coordinator");
    } else {
      handleConfigurationByProgramId(userData, "teacher");
    }
  };

  const handleConfigurationByCampusId = async (campus) => {
    try {
      const response = await APIConfiguracion.getByIdCampus(campus.id);

      if (response.status === 200) {
        const stringUser = JSON.stringify(campus);
        localStorage.setItem("User", stringUser);

        const actualConfiguration = response.data.configurations;
        const StringConfiguration = JSON.stringify(actualConfiguration);
        localStorage.setItem("Configuration", StringConfiguration);
        setConfiguration(actualConfiguration);

        setLoading(false);
        navigate("/admin");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setMessage("No tiene permisos para acceder a esta sección");
        setLoading(false);
        setOpen(true);
      } else if (error.response.status === 404) {
        const stringUser = JSON.stringify(campus);
        localStorage.setItem("User", stringUser);

        setLoading(false);
        navigate("/admin");
      }
    }
  };

  const handleConfigurationByProgramId = async (data, role) => {
    try {
      const response = await APIConfiguracion.getByIdProgram(data.program_id);

      if (response.status === 200) {
        const actualConfiguration = response.data.configurations;
        const StringConfiguration = JSON.stringify(actualConfiguration);
        localStorage.setItem("Configuration", StringConfiguration);
        setConfiguration(actualConfiguration);

        setLoading(false);
        if (role === "coordinator") {
          const stringUser = JSON.stringify(data);
          localStorage.setItem("User", stringUser);

          navigate("/coordinator");
        } else {
          const now = new Date();
          const startDate = new Date(actualConfiguration.start_date);
          const endDate = new Date(actualConfiguration.end_date);

          if (now >= startDate && now <= endDate) {
            const stringUser = JSON.stringify(data);
            localStorage.setItem("User", stringUser);
            navigate("/home");
          } else {
            setMessage("No se encuentra en fecha de registro");
            setLoading(false);
            setOpen(true);
          }
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        setMessage("Error: no tiene permisos para acceder a esta sección");
        setLoading(false);
        setOpen(true);
      } else if (error.response.status === 404) {
        setMessage("No se encuentran fechas activas de semestre");
        setLoading(false);
        setOpen(true);
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
                      <Close fontSize="inherit" />
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
                        <Visibility
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleClickShowPassword();
                          }}
                        />
                      )}
                      {showPassword && (
                        <VisibilityOff
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
                Recuperar contraseña
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
