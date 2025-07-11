import React from "react";
import { UseContext } from "../context/UseContext.js";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  TextField,
  ThemeProvider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import * as APIformat from "../API/FormatCall.js";
import * as APIactividades from "../API/ActivityCall.js";
import * as APISchedule from "../API/ScheduleCall.js";
import { theme } from "../resources/theme.js";
import "../styles/scheduleTable.css";

function ScheduleTable() {
  const {
    activities,
    setActivities,
    user,
    dataSchedule,
    setDataSchedule,
    configuration,
    setSesionInvalid,
    setTab,
  } = React.useContext(UseContext);

  const [loading, setLoading] = React.useState(false);
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
  const [observation, setObservation] = React.useState("");

  const [decimal, setDecimal] = React.useState();

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

  const handleSubmitButton = async () => {
    for (const item of activities) {
      if (item.product.estimated_date === undefined) {
        setMessage("Revisar fecha estimada de productos");
        setCode("error");
        handleClick();
        return;
      }
    }

    setLoading(true);
    try {
      const searchResponse = await APIformat.getByTeacherIdAndSemester(
        user?.id,
        configuration?.semester
      );
      if (searchResponse.status === 200) {
        const updateResponse = await APIformat.putSchedule(
          searchResponse.data.format.id,
          { is_finish: true, observation: observation }
        );

        if (updateResponse.status === 200) {
          setLoading(false);
          setTab(5);
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      }

      if (error.response.status === 404) {
        try {
          const postResponse = await APIformat.postFormat({
            semester: configuration?.semester,
            is_finish: true,
            teacher_id: user?.id,
            observation: observation,
          });

          if (postResponse.status === 200) {
            setLoading(false);
            setTab(5);
          }
        } catch (error) {
          if (error.response.status === 401) {
            setSesionInvalid(true);
          }
        }
      }
    }
  };

  const handleCreateSchedule = async (activity) => {
    try {
      const deleteResponse = await APISchedule.deleteSchedule(
        user?.id,
        configuration?.semester,
        selectedColumn.dia,
        selectedColumn.momento
      );

      const response = await APISchedule.postSchedule({
        semester: configuration?.semester,
        name: `${activity.name}: ${activity.description} ${activity.group_name}`,
        classification: activity.convention,
        day: selectedColumn.dia,
        moment: selectedColumn.momento,
        teacher_id: user?.id,
        activity_id: activity.id,
      });

      if (response.status === 200) {
        fetchDataSchedule();
        setMessage("Actividad agregada al horario");
        setCode("success");
        handleClick();

        try {
          const searchResponse = await APIformat.getByTeacherIdAndSemester(
            user?.id,
            configuration?.semester
          );

          if (searchResponse.status === 200) {
            const updateResponse = await APIformat.putSchedule(
              searchResponse.data.format.id,
              {
                is_finish: false,
              }
            );
          }
        } catch (error) {}
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      }

      if (error.response.status === 404) {
        try {
          const response = await APISchedule.postSchedule({
            semester: configuration?.semester,
            name: `${activity.name}: ${activity.description} ${activity.group_name}`,
            classification: activity.convention,
            day: selectedColumn.dia,
            moment: selectedColumn.momento,
            teacher_id: user?.id,
            activity_id: activity.id,
          });

          if (response.status === 200) {
            fetchDataSchedule();
            setMessage("Actividad agregada al horario");
            setCode("success");
            handleClick();
          }
        } catch (error) {
          if (error.response.status === 401) {
            setSesionInvalid(true);
          } else {
            fetchDataSchedule();
            setMessage("Error al agregar actividad, inténtelo nuevamente");
            setCode("error");
            handleClick();
          }
        }
      }
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const deleteResponse = await APISchedule.deleteSchedule(
        user?.id,
        configuration?.semester,
        selectedColumn.dia,
        selectedColumn.momento
      );
      if (deleteResponse.status === 200) {
        fetchDataSchedule();
        setMessage("Actividad eliminada del horario");
        setCode("warning");
        handleClick();

        try {
          const searchResponse = await APIformat.getByTeacherIdAndSemester(
            user?.id,
            configuration?.semester
          );

          if (searchResponse.status === 200) {
            const updateResponse = await APIformat.putSchedule(
              searchResponse.data.format.id,
              {
                is_finish: false,
              }
            );
          }
        } catch (error) {}
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response.status === 404) {
        fetchDataSchedule();
        setMessage("No existe alguna actividad para eliminar");
        setCode("error");
        handleClick();
      } else {
        fetchDataSchedule();
        setMessage("Error al eliminar, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleDeleteAllSchedule = async () => {
    try {
      const deleteResponse = await APISchedule.deleteAllSchedule(
        user?.id,
        configuration?.semester
      );
      if (deleteResponse.status === 200) {
        fetchDataSchedule();
        setMessage("Horario eliminado correctamente");
        setCode("warning");
        handleClick();

        try {
          const searchResponse = await APIformat.getByTeacherIdAndSemester(
            user?.id,
            configuration?.semester
          );

          if (searchResponse.status === 200) {
            const updateResponse = await APIformat.putSchedule(
              searchResponse.data.format.id,
              {
                is_finish: false,
              }
            );
          }
        } catch (error) {}
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response.status === 404) {
        fetchDataSchedule();
        setMessage("No existen actividades para eliminar");
        setCode("error");
        handleClick();
      } else {
        fetchDataSchedule();
        setMessage("Error al eliminar, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const fetchDataSchedule = async () => {
    try {
      const response = await APISchedule.getByTeacherIdAndSemester(
        user?.id,
        configuration?.semester
      );
      if (response.status === 200) {
        localStorage.setItem(
          "Schedule",
          JSON.stringify({
            schedule: response.data.schedule,
          })
        );

        setDataSchedule(response.data.schedule);

        try {
          const formatResponse = await APIformat.getByTeacherIdAndSemester(
            user?.id,
            configuration?.semester
          );

          if (formatResponse.status === 200) {
            setObservation(formatResponse.data.format.observation);
          }
        } catch (errorFormat) {
          if (errorFormat.response.status === 401) {
            setSesionInvalid(true);
          }

          if (errorFormat.response.status === 404) {
            setObservation();
          }
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
        setDataSchedule();
      }
    }
  };

  React.useEffect(() => {
    if (user?.id !== undefined) {
      const fetchData = async () => {
        try {
          const responseData = await APIactividades.getbyIdDocenteAndSemester(
            user?.id,
            configuration?.semester
          );

          if (responseData.status === 200) {
            localStorage.setItem(
              "Activity",
              JSON.stringify({
                activities: responseData.data.activities,
              })
            );

            setActivities(responseData.data.activities);

            await fetchDataSchedule();
          }
        } catch (error) {
          if (error.response.status === 401) {
            setSesionInvalid(true);
          } else {
            const dataStr = localStorage.getItem("Activity");
            const data = JSON.parse(dataStr);

            if (!data || data?.activities.length === 0) {
              setMessage("Debe ingresar actividades para registrar el horario");
              setCode("warning");
              handleClick();
            }
          }
        }
      };
      fetchData();
    } else {
    }
  }, [user]);

  React.useEffect(() => {
    if (user?.id !== undefined) {
      if (
        user?.employment_type === "Carrera" ||
        user?.employment_type === "Tiempo completo"
      ) {
        setDecimal(
          parseFloat(configuration?.tc_hours) -
            Math.floor(parseFloat(configuration?.tc_hours))
        );
      } else {
        setDecimal(
          parseFloat(configuration?.mt_hours) -
            Math.floor(parseFloat(configuration?.mt_hours))
        );
      }
    }
  }, [configuration]);
  return (
    <>
      <div className="table-form">
        <Grid container>
          <Grid xs={12}>
            <div className="title-finish">Horario semanal</div>
          </Grid>
        </Grid>

        <ThemeProvider theme={theme}>
          <Grid container rowSpacing={1} columnSpacing={1} marginBottom={4}>
            <Grid xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  handleDeleteAllSchedule();
                }}
              >
                Reiniciar horario
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>

        <TableContainer sx={{ marginBottom: 5, marginTop: 1 }}>
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
                  Miércoles
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
                  Sábado
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
                      className={dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Lunes") {
                          return item?.classification.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Lunes") {
                          return item?.name;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Martes", index);
                      }}
                      className={dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Martes") {
                          return item?.classification.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Martes") {
                          return item?.name;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Miércoles", index);
                      }}
                      className={dataSchedule?.map((item) => {
                        if (
                          item?.moment === index &&
                          item?.day === "Miércoles"
                        ) {
                          return item?.classification.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule?.map((item) => {
                        if (
                          item?.moment === index &&
                          item?.day === "Miércoles"
                        ) {
                          return item?.name;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Jueves", index);
                      }}
                      className={dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Jueves") {
                          return item?.classification.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Jueves") {
                          return item?.name;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Viernes", index);
                      }}
                      className={dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Viernes") {
                          return item?.classification.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Viernes") {
                          return item?.name;
                        }
                      })}
                    </TableCell>
                    <TableCell
                      sx={{ border: 1 }}
                      align="center"
                      onClick={(event) => {
                        handleClickOpen(event, "Sábado", index);
                      }}
                      className={dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Sábado") {
                          return item?.classification.split(" ").join("");
                        } else {
                          return "color-vacio";
                        }
                      })}
                    >
                      {dataSchedule?.map((item) => {
                        if (item?.moment === index && item?.day === "Sábado") {
                          return item?.name;
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
                  {dataSchedule?.filter((item) => item?.day === "Lunes").length}
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
                    dataSchedule?.filter((item) => item?.day === "Martes")
                      .length
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
                    dataSchedule?.filter((item) => item?.day === "Miércoles")
                      .length
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
                    dataSchedule?.filter((item) => item?.day === "Jueves")
                      .length
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
                    dataSchedule?.filter((item) => item?.day === "Viernes")
                      .length
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
                    dataSchedule?.filter((item) => item?.day === "Sábado")
                      .length
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
                  {dataSchedule === undefined
                    ? "0"
                    : user?.employment_type === "Carrera" ||
                      user?.employment_type === "Tiempo completo"
                    ? (dataSchedule?.length + decimal).toLocaleString()
                    : (dataSchedule?.length + decimal).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <ThemeProvider theme={theme}>
          <Grid container rowSpacing={3} columnSpacing={1}>
            <Grid xs={12}>
              <TextField
                label="Observación general"
                id="outlined-multiline-static"
                size="small"
                fullWidth
                multiline
                rows={4}
                maxRows={4}
                name="observacion"
                value={observation}
                onChange={(event) => {
                  setObservation(event.target.value);
                }}
              />
            </Grid>

            <Grid xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setTab(3);
                }}
              >
                Regresar
              </Button>
            </Grid>

            <Grid xs={6}>
              <Button
                disabled={
                  (user?.employment_type === "Carrera" ||
                  user?.employment_type === "Tiempo completo"
                    ? dataSchedule?.length + decimal !==
                      parseFloat(configuration?.tc_hours)
                    : dataSchedule?.length + decimal !==
                      parseFloat(configuration?.mt_hours)) || loading
                }
                variant="contained"
                fullWidth
                onClick={() => {
                  handleSubmitButton();
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
                  handleDeleteSchedule();
                  handleClose();
                }}
              >
                <ListItemText primary={`Eliminar actividad seleccionada`} />
              </ListItemButton>
            </ListItem>
            {selectedColumn.dia === "Sábado"
              ? activities
                  ?.filter((item) => item.consolidated === "Docencia")
                  .map((item, index) => {
                    const count = dataSchedule?.filter(
                      (element) =>
                        element.name ===
                        `${item.name}: ${item.description} ${item.group_name}`
                    ).length;

                    if (count === parseInt(item.hours)) {
                      return null;
                    } else {
                      return (
                        <ListItem disableGutters key={index}>
                          <ListItemButton
                            onClick={() => {
                              handleCreateSchedule(item);
                              handleClose();
                            }}
                          >
                            <ListItemText
                              primary={`${item.name}: ${item.description} ${item.group_name} - ${item.hours} horas`}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    }
                  })
              : activities?.map((item, index) => {
                  const count = dataSchedule?.filter(
                    (element) =>
                      element.name ===
                      `${item.name}: ${item.description} ${item.group_name}`
                  ).length;

                  if (count === parseInt(item.hours)) {
                    return null;
                  } else {
                    return (
                      <ListItem disableGutters key={index}>
                        <ListItemButton
                          onClick={() => {
                            handleCreateSchedule(item);

                            handleClose();
                          }}
                        >
                          <ListItemText
                            primary={`${item.name}: ${item.description} ${item.group_name} - ${item.hours} horas`}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  }
                })}
          </List>
        </DialogContent>
        <DialogActions>
          <ThemeProvider theme={theme}>
            <Button onClick={handleClose}>Cancelar</Button>
          </ThemeProvider>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnack}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
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
