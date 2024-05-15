import React from "react";
import "../styles/personalForm.css";
import { UseContext } from "../context/UseContext.js";
import Grid from "@mui/material/Unstable_Grid2";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import * as APIactividades from "../API/ActivityCall.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ActivityList() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const { user, actividades, setActividades, setTab, tab, isFirstActivity } =
    React.useContext(UseContext);
  const totalHoras = actividades?.actividad?.reduce(
    (total, actividad) => total + parseFloat(actividad.horas),
    0
  );

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

  const handleDeleteActivity = (activity) => {
    const nuevoArray = actividades.actividad.filter(
      (item, index) => index !== activity
    );

    setActividades((prevState) => ({
      ...prevState,
      actividad: nuevoArray,
    }));
  };

  const handleSubmitButton = async () => {
    setLoading(true);
    try {
      let response;
      if (actividades?._id) {
        try {
          response = await APIactividades.updateActivity(actividades?._id, {
            actividad: actividades.actividad,
          });
        } catch (error) {
          setMessage(
            "Error al actualizar las actividades, intentelo nuevamente"
          );
          setCode("error");
          handleClick();
        }
      } else {
        try {
          response = await APIactividades.saveActivitys({
            idDocente: actividades.idDocente,
            actividad: actividades.actividad,
          });
        } catch (error) {
          setMessage("Error al guardar las actividades, intentelo nuevamente");
          setCode("error");
          handleClick();
        }
      }
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          navigate("/product");
        }, 3000);
      } else if (response.status === 404) {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      setMessage("Error, intentelo nuevamente");
      setCode("error");
      handleClick();
    }
  };

  return (
    <>
      <div className="form-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-form">Actividades registradas</div>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Descripcion</TableCell>
                <TableCell align="center">Grupo</TableCell>
                <TableCell align="center">Horas</TableCell>
                <TableCell align="center">Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actividades?.actividad?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {row.nombre}
                  </TableCell>
                  <TableCell align="center">{row.descripcion}</TableCell>
                  <TableCell align="center">
                    {row.grupo || "No aplica"}
                  </TableCell>
                  <TableCell align="center">
                    {parseFloat(row.horas).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <DeleteOutlineIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleDeleteActivity(index);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: "#f0f0f0",
                }}
              >
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>

                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Total horas semanales:
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {totalHoras?.toLocaleString()}
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container rowSpacing={3} columnSpacing={1}>
          <ThemeProvider theme={theme}>
            <Grid xs={12} mt={5}>
              NOTA: "Adóptese la hora académica, con una equivalencia de 45
              minutos, como la unidad de tiempo para contabilizar las horas de
              dedicación de los docentes a actividades académicas. Adóptese como
              unidad de tiempo para contabilizar la dedicación de los docentes a
              actividades de aula, el equivalente a 45 minutos".
            </Grid>

            <Grid xs={12} mt={1}>
              Recuerde: El numero total de horas semanales para docentes con
              vinculacion de {user?.vinculacion} debe ser igual a{" "}
              {user?.vinculacion === "Planta" ||
              user?.vinculacion === "Tiempo completo"
                ? "53,33"
                : "26,66"}
              .
            </Grid>

            <Grid xs={6} sm={6} md={6} lg={6}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                onClick={() => {
                  setTab(tab - 1);
                  navigate("/home");
                }}
              >
                Regresar
              </Button>
            </Grid>

            <Grid xs={6} sm={6} md={6} lg={6}>
              {user?.vinculacion === "Planta" ||
              user?.vinculacion === "Tiempo completo" ? (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={totalHoras !== 53.33}
                  onClick={() => handleSubmitButton()}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Continuar"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={totalHoras !== 26.66}
                  onClick={() => handleSubmitButton()}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Continuar"
                  )}
                </Button>
              )}
            </Grid>
          </ThemeProvider>

          <Grid xs={4}></Grid>
          <Grid xs={8}></Grid>
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
