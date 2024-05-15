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
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import * as APIdocentes from "../API/TeacherCall.js";

function ChangeForm() {
  const navigate = useNavigate();
  const { setUser, user } = React.useContext(UseContext);
  const [severity, setSeverity] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openCollapse, setOpenCollapse] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const passwordInput = React.useRef(null);
  const confirmInput = React.useRef(null);
  const firstPasswordInput = React.useRef(null);
  const documentInput = React.useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmitLogin = async () => {
    const document = documentInput.current.value;
    const firstPassword = firstPasswordInput.current.value;
    const password = passwordInput.current.value;
    const confirm = confirmInput.current.value;

    if (!!password && !!confirm && !!document && !!firstPassword) {
      if (password === confirm) {
        try {
          const response = await APIdocentes.getTeacherByCredentials(
            document,
            firstPassword
          );

          if (response.status === 200) {
            try {
              const changeResponse = await APIdocentes.updateTeacher(
                response.data.teacher._id,
                { contrasena: password }
              );

              if (changeResponse.status === 200) {
                setSeverity("success");
                setMessage("Contraseña actualizada correctamente");
                setTimeout(() => {
                  setLoading(false);

                  setOpenCollapse(true);
                }, 3000);
              }
            } catch (error) {
              setLoading(false);
              setSeverity("error");
              setMessage("Error: intentelo mas tarde");
              setOpenCollapse(true);
            }
          } else if (response.status === 404) {
            setSeverity("error");
            setMessage("Los datos ingresados son incorrectos");
            setTimeout(() => {
              setLoading(false);
              setOpenCollapse(true);
            }, 3000);
          }
        } catch (error) {
          setLoading(false);
          setSeverity("error");
          setMessage("Error: intentelo mas tarde");
          setOpenCollapse(true);
        }
      } else {
        setLoading(false);
        setSeverity("error");
        setMessage("La confirmacion de la nueva contraseña no coincide");
        setOpenCollapse(true);
      }
    } else {
      setLoading(false);
      setSeverity("error");
      setMessage("No se admiten campos vacios");
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
              Estimado usuario, si continua presentando problemas con su
              contraseña acerquese a su corresponsiente facultad para realizar
              la solicitud de revision de su cuenta, ademas tenga en cuenta las
              siguientes observaciones para un correcto uso de sus datos:
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - Para el ingreso debe haber sido registrado en la base de datos
              de docentes de la facultad.
            </div>
          </Grid>

          <Grid xs={12}>
            <div>
              - Recuerde que su contraseña debe cumplir con los siguientes
              requisitos: debe contener un numero, al menos una letra en
              mayuscula y debe tener al menos 8 caracteres.
            </div>
          </Grid>
          <Grid xs={12}>
            <div>
              - Se recomienda no usar sus datos personales como una contraseña.
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="login-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-login">Crear nueva contraseña</div>
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
                label="Documento"
                size="small"
                fullWidth
                type="number"
                inputRef={documentInput}
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
