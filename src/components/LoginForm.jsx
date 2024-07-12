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

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser, user } = React.useContext(UseContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const documentInput = React.useRef(null);
  const passwordInput = React.useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmitLogin = async () => {
    const document = documentInput.current.value;
    const password = passwordInput.current.value;
    setLoading(true);

    if (!!document && !!password) {
      if (
        document === process.env.REACT_APP_ADMIN_DOCUMENT &&
        password === process.env.REACT_APP_ADMIN_PASSWORD
      ) {
        setLoading(false);
        setUser({ user: "admin", role: "admin" });
        localStorage.setItem(
          "User",
          JSON.stringify({ user: "admin", role: "admin" })
        );
        navigate("/admin");
      } else {
        try {
          const response = await APIdocentes.getTeacherByCredentials(
            document,
            password
          );

          if (response.status === 200) {
            setTimeout(() => {
              const actualTeacher = response.data.teacher;
              const StringTeacher = JSON.stringify(actualTeacher);
              localStorage.setItem("User", StringTeacher);
              setUser(actualTeacher);
              setLoading(false);
              navigate("/home");
            }, 3000);
          }
        } catch (error) {
          if (error.response.status === 404) {
            setMessage("Los datos ingresados son incorrectos");
            setTimeout(() => {
              setLoading(false);
              setOpen(true);
            }, 3000);
          } else if (error.response.status === 401) {
            setMessage("Docente inactivo, comuniquese con decanatura");
            setTimeout(() => {
              setLoading(false);
              setOpen(true);
            }, 3000);
          } else if (error.response.status === 500) {
            setMessage("Error: intentelo mas tarde");
            setTimeout(() => {
              setLoading(false);
              setOpen(true);
            }, 3000);
          }
        }
      }
    } else {
      setOpen(true);
      setMessage("No se admiten campos vacios");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
      } else if (data?.role === "admin") {
        setUser(data);
        navigate("/admin");
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
                label="Documento"
                size="small"
                fullWidth
                type="number"
                inputRef={documentInput}
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
