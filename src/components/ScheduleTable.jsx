import React from "react";
import { UseContext } from "../context/UseContext.js";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as APIactividades from "../API/ActivityCall.js";
import * as APISchedule from "../API/ScheduleCall.js";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import "../styles/scheduleTable.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ScheduleTable() {
  const navigate = useNavigate();
  const {
    actividades,
    setActividades,
    user,
    setIsFirstActivity,
    isFirstActivity,
    setTab,
    tab,
    page,
    setPage,
    dataSchedule,
    setDataSchedule,
  } = React.useContext(UseContext);

  const [loading, setLoading] = React.useState(false);
  const [observacion, setObservacion] = React.useState("");
  const [scheduleId, setScheduleId] = React.useState();
  const HORAS = [
    "6:00 a 6:45 a.m.",
    "6:45 a 7:30 a.m.",
    "7:30 a 8:15 a.m.",
    "8:15 a 9:00 a.m.",
    "9:00 a 9:45 a.m.",
    "9:45 a 10:30 a.m.",
    "10:30 a 11:15 a.m.",
    "11:15 a 12:00 a.m.",
    "12:00 a 12:45 p.m.",
    "12:45 a 1:30 p.m.",
    "1:30 a 2:15 p.m.",
    "2:15 a 3:00 p.m.",
    "3:00 a 3:45 p.m.",
    "3:45 a 4:30 p.m.",
    "4:30 a 5:15 p.m.",
    "5:15 a 6:00 p.m.",
    "6:30 a 7:15 p.m.",
    "7:15 a 8:00 p.m.",
    "8:15 a 9:00 p.m.",
    "9:00 a 9:45 p.m.",
  ];

  const [selectedTime, setSelectedTime] = React.useState();
  const [selectedColumn, setSelectedColumn] = React.useState({});

  const [open, setOpen] = React.useState(false);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const handleClickOpen = (e, dia, hora) => {
    setOpen(true);
    setSelectedTime(e);
    setSelectedColumn({ dia: dia, momento: hora });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitButton = async (complete) => {
    setLoading(true);
    try {
      let response;

      if (!scheduleId) {
        response = await APISchedule.postSchedule({
          idActividades: isFirstActivity,
          horas: dataSchedule,
          observacion: observacion,
        });
      } else {
        response = await APISchedule.putSchedule(scheduleId, {
          horas: dataSchedule,
          observacion: observacion,
        });
      }
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          if (complete) {
            navigate("/finish");
          } else {
            setLoading(false);
            setMessage("Horario guardado con éxito");
            setCode("success");
            handleClick();
          }
        }, 3000);
      } else if (response.status === 404) {
        setTimeout(() => {
          setLoading(false);
          setMessage("Error al guardar el horario, intentelo nuevamente");
          setCode("error");
          handleClick();
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      setMessage("Error, intentelo nuevamente");
      setCode("error");
      handleClick();
    }
  };

  const countArray = (valor) => {
    let contador = 0;
    dataSchedule.forEach((elemento) => {
      if (elemento.actividad === valor) {
        contador++;
      }
    });
    return contador;
  };

  React.useEffect(() => {
    if (user?._id != undefined) {
      const fetchDataSchedule = async (id) => {
        try {
          const response = await APISchedule.getByIdActivity(id);
          if (response.status === 200) {
            localStorage.setItem(
              "Schedule",
              JSON.stringify({
                idActividades: id,
                horas: response.data.schedule[0].horas,
              })
            );

            setDataSchedule(response.data.schedule[0].horas);
            setScheduleId(response.data.schedule[0]._id);
          }
        } catch (error) {}
      };

      const fetchData = async () => {
        try {
          const responseData = await APIactividades.getbyIdDocenteAndSemester(
            user?._id
          );

          if (responseData.status === 200) {
            setIsFirstActivity(responseData.data.activity[0]._id);
            localStorage.setItem(
              "Activity",
              JSON.stringify({
                actividad: responseData.data.activity[0].actividad,
                semestre: process.env.REACT_APP_CURRENT_SEMESTER,
                idDocente: user?._id,
                _id: responseData.data.activity[0]._id,
              })
            );

            setActividades((prevState) => ({
              ...prevState,
              actividad: responseData.data.activity[0].actividad,
              _id: responseData.data.activity[0]._id,
            }));

            await fetchDataSchedule(responseData.data.activity[0]._id);
          }
        } catch (error) {
          if (!!actividades) {
            const dataStr = localStorage.getItem("Activity");
            const data = JSON.parse(dataStr);
            if (data) {
              setActividades(data);
            } else {
              navigate("/activity");
            }
          }
        }
      };

      fetchData();
    } else {
    }
  }, [user]);
  return (
    <>
      <div className="table-form">
        <Grid container>
          <Grid xs={12}>
            <div className="title-form">Horario semanal</div>
          </Grid>
        </Grid>

        <ThemeProvider theme={theme}>
          <Grid container rowSpacing={3} columnSpacing={1}>
            <Grid xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setDataSchedule([]);
                }}
              >
                Restablecer datos del horario
              </Button>
            </Grid>
            <Grid xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  handleSubmitButton(false);
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Guardar progreso del horario"
                )}
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>

        <TableContainer sx={{ marginBottom: 5, marginTop: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    height: "10px",
                  }}
                >
                  Hora
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{ width: "100px", backgroundColor: "#f0f0f0" }}
                >
                  Lunes
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{ width: "100px", backgroundColor: "#f0f0f0" }}
                >
                  Martes
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{ width: "100px", backgroundColor: "#f0f0f0" }}
                >
                  Miercoles
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{ width: "100px", backgroundColor: "#f0f0f0" }}
                >
                  Jueves
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{ width: "100px", backgroundColor: "#f0f0f0" }}
                >
                  Viernes
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{ width: "100px", backgroundColor: "#f0f0f0" }}
                >
                  Sabado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {HORAS.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ border: 1 }} align="center">
                      {item}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Lunes", index);
                      }}
                      className={dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Lunes"
                        ) {
                          return item?.clasificacion.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Lunes"
                        ) {
                          return item?.actividad;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Martes", index);
                      }}
                      className={dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Martes"
                        ) {
                          return item?.clasificacion.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Martes"
                        ) {
                          return item?.actividad;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Miercoles", index);
                      }}
                      className={dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Miercoles"
                        ) {
                          return item?.clasificacion.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Miercoles"
                        ) {
                          return item?.actividad;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Jueves", index);
                      }}
                      className={dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Jueves"
                        ) {
                          return item?.clasificacion.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Jueves"
                        ) {
                          return item?.actividad;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Viernes", index);
                      }}
                      className={dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Viernes"
                        ) {
                          return item?.clasificacion.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Viernes"
                        ) {
                          return item?.actividad;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Sabado", index);
                      }}
                      className={dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Sabado"
                        ) {
                          return item?.clasificacion.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule.map((item) => {
                        if (
                          item.registro[0].momento === index &&
                          item.registro[0].dia === "Sabado"
                        ) {
                          return item?.actividad;
                        }
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 1 } }}
              >
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  Horas de 45 minutos
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {
                    dataSchedule.filter(
                      (item) => item.registro[0].dia === "Lunes"
                    ).length
                  }
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {
                    dataSchedule.filter(
                      (item) => item.registro[0].dia === "Martes"
                    ).length
                  }
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {
                    dataSchedule.filter(
                      (item) => item.registro[0].dia === "Miercoles"
                    ).length
                  }
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {
                    dataSchedule.filter(
                      (item) => item.registro[0].dia === "Jueves"
                    ).length
                  }
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {
                    dataSchedule.filter(
                      (item) => item.registro[0].dia === "Viernes"
                    ).length
                  }
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {
                    dataSchedule.filter(
                      (item) => item.registro[0].dia === "Sabado"
                    ).length
                  }
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  Total horas semanal de 45 minutos
                </TableCell>
                <TableCell
                  sx={{ border: 1 }}
                  align="center"
                  style={{
                    width: "100px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  {user?.vinculacion === "Planta" ||
                  user?.vinculacion === "Tiempo completo"
                    ? (dataSchedule.length + 0.33).toLocaleString()
                    : (dataSchedule.length + 0.666).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <ThemeProvider theme={theme}>
          <Grid container rowSpacing={3} columnSpacing={1}>
            <Grid xs={12}>
              <TextField
                label="Observacion general"
                id="outlined-multiline-static"
                size="small"
                fullWidth
                multiline
                rows={4}
                maxRows={4}
                name="observacion"
                value={observacion}
                onChange={(event) => {
                  setObservacion(event.target.value);
                }}
              />
            </Grid>

            <Grid xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  navigate("/product");
                }}
              >
                Regresar
              </Button>
            </Grid>
            <Grid xs={6}>
              <Button
                disabled={
                  user?.vinculacion === "Planta" ||
                  user?.vinculacion === "Tiempo completo"
                    ? dataSchedule.length + 0.33 !== 53.33
                    : dataSchedule.length + 0.666 !== 26.666
                }
                variant="contained"
                fullWidth
                onClick={() => {
                  handleSubmitButton(true);
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Continuar"
                )}
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Lista de actividades</DialogTitle>
        <DialogContent>
          <List sx={{ pt: 0 }}>
            <ListItem disableGutters>
              <ListItemButton
                onClick={() => {
                  const nuevoArray = [];

                  dataSchedule.forEach((item) => {
                    if (
                      item.actividad === selectedTime.target.textContent &&
                      item.registro[0]?.momento === selectedColumn.momento &&
                      item.registro[0]?.dia === selectedColumn.dia
                    ) {
                    } else {
                      nuevoArray.push(item);
                    }
                  });

                  setDataSchedule(nuevoArray);
                  handleClose();
                }}
              >
                <ListItemText primary={`Eliminar Actividad`} />
              </ListItemButton>
            </ListItem>
            {actividades?.actividad.map((item, index) => (
              <ListItem disableGutters key={index}>
                <ListItemButton
                  onClick={() => {
                    let firstCount = countArray(
                      `${item.nombre}: ${item.descripcion} ${item.grupo}`
                    );
                    if (firstCount < Math.floor(item.horas)) {
                      const nuevoArray = [];

                      dataSchedule.forEach((itemBefore) => {
                        if (
                          itemBefore.actividad ===
                            selectedTime.target.textContent &&
                          itemBefore.registro[0]?.momento ===
                            selectedColumn.momento &&
                          itemBefore.registro[0]?.dia === selectedColumn.dia
                        ) {
                        } else {
                          nuevoArray.push(itemBefore);
                        }
                      });

                      nuevoArray.push({
                        actividad: `${item.nombre}: ${item.descripcion} ${item.grupo}`,
                        clasificacion: item.convencion,
                        registro: [
                          {
                            dia: selectedColumn.dia,
                            momento: selectedColumn.momento,
                          },
                        ],
                      });

                      setDataSchedule(nuevoArray);
                    } else {
                      setMessage("Ya completaste las horas de esa actividad");
                      setCode("warning");
                      handleClick();
                    }

                    handleClose();
                  }}
                >
                  <ListItemText
                    primary={`${item.nombre}: ${item.descripcion} ${item.grupo} - ${item.horas} horas`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnack}
        onClose={handleCloseSnack}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleCloseSnack}
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

export default ScheduleTable;
