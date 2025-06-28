import React from "react";
import "../styles/personalForm.css";
import { UseContext } from "../context/UseContext.js";
import Grid from "@mui/material/Unstable_Grid2";
import {
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { theme } from "../resources/theme.js";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import * as APIactividades from "../API/ActivityCall.js";
import * as APIschedule from "../API/ScheduleCall.js";
import * as APIformat from "../API/FormatCall.js";

export default function ActivityList() {
  const [loading, setLoading] = React.useState(false);
  const {
    user,
    activities,
    setActivities,
    setTab,
    configuration,
    setSesionInvalid,
  } = React.useContext(UseContext);

  const [editingId, setEditingId] = React.useState(null);
  const [editHours, setEditHours] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");

  const totalHoras = activities?.reduce(
    (total, actividad) => total + parseFloat(actividad.hours),
    0
  );

  const handleEditClick = (id, hours) => {
    setEditingId(id);
    setEditHours(hours.toString());
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleDeleteActivity = async (id) => {
    try {
      const deleteResponse = await APIactividades.deleteActivity(id);

      if (deleteResponse.status === 200) {
        setMessage("Actividad eliminada correctamente");
        setCode("success");
        handleClick();
        fetchActivities();

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
                is_coord_signed: false,
                is_dean_signed: false,
              }
            );
          }
        } catch (error) {}
      }
    } catch (errorDelete) {
      if (errorDelete.response.status === 401) {
        setSesionInvalid(true);
      } else if (errorDelete.response.status === 404) {
        setMessage("Error al eliminar la actividad");
        setCode("warning");
        handleClick();
      }
    }
  };

  const handleUpdateActivity = async (id) => {
    try {
      const response = await APIactividades.updateActivity(id, {
        hours: editHours,
      });
      if (response.status === 200) {
        setMessage("Actividad actualizada correctamente");
        setCode("success");
        handleClick();
        setEditingId(null);
        setEditHours("");
        fetchActivities();

        try {
          const deleteResponse = await APIschedule.deleteScheduleByActivityId(
            id
          );
        } catch (error) {}

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
                is_coord_signed: false,
                is_dean_signed: false,
              }
            );
          }
        } catch (error) {}
      }
    } catch (error) {
      setEditingId(null);
      setEditHours("");
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response.status === 404) {
        setMessage("Error al actualizar la actividad");
        setCode("warning");
        handleClick();
      }
    }
  };

  const handleSubmitButton = async () => {
    if (user && activities) {
      setTab(3);
    }
  };

  const fetchActivities = async () => {
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
            teacher_id: user?._id,
          })
        );

        setActivities(responseData.data.activities);
      }
    } catch (errorActivities) {
      if (errorActivities.response.status === 404) {
        setActivities();
        localStorage.setItem(
          "Activity",
          JSON.stringify({
            activities: [],
            teacher_id: user?._id,
          })
        );
      }
    }
  };

  return (
    <>
      <div className="form-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-finish">Actividades registradas</div>
          </Grid>
          <Grid xs={12}>
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              {user?.employment_type === "Carrera" ||
              user?.employment_type === "Tiempo completo"
                ? (configuration?.tc_hours - totalHoras).toLocaleString()
                : (configuration?.mt_hours - totalHoras).toLocaleString()}{" "}
              horas por registrar
            </div>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Grupo</TableCell>
                <TableCell align="center">Horas</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {row.name}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="center">
                    {row.group_name || "No aplica"}
                  </TableCell>
                  <TableCell align="center">
                    {editingId === row.id ? (
                      <TextField
                        value={editHours}
                        onChange={(e) => setEditHours(e.target.value)}
                        size="small"
                        type="number"
                        inputProps={{ step: "0.1" }}
                        sx={{ width: "80px", fontSize: "10px" }}
                      />
                    ) : (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(row.id, row.hours)}
                      >
                        {parseFloat(row.hours).toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editingId === row.id ? (
                      <CheckIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleUpdateActivity(row.id)}
                      />
                    ) : (
                      <DeleteOutlineIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteActivity(row.id)}
                      />
                    )}
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

            {user?.employment_type && (
              <Grid xs={12} mt={1}>
                Recuerde: El número total de horas semanales para docentes con
                vinculación de {user?.employment_type} debe ser igual a{" "}
                {user?.employment_type === "Carrera" ||
                user?.employment_type === "Tiempo completo"
                  ? configuration?.tc_hours?.replace(".", ",")
                  : configuration?.mt_hours?.replace(".", ",")}
                .
              </Grid>
            )}

            <Grid xs={6} sm={6} md={6} lg={6}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                onClick={() => {
                  setTab(1);
                }}
              >
                Regresar
              </Button>
            </Grid>

            <Grid xs={6} sm={6} md={6} lg={6}>
              {user?.employment_type === "Carrera" ||
              user?.employment_type === "Tiempo completo" ? (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={
                    totalHoras !== parseFloat(configuration?.tc_hours) ||
                    loading
                  }
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
                  disabled={
                    totalHoras !== parseFloat(configuration?.mt_hours) ||
                    loading
                  }
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

      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
      >
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
