import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  TextField,
  Button,
  CircularProgress,
  ThemeProvider,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm } from "../hooks/UseForms.js";
import { UseContext } from "../context/UseContext.js";
import { ConfigurationValidation } from "../validations/ConfigurationValidation.js";
import { theme } from "../resources/theme.js";
import * as APIconfiguracion from "../API/ConfigurationCall.js";
import * as APIactivity from "../API/ActivityCall.js";
import dayjs from "dayjs";

export default function CampusConfiguration() {
  const { user, setConfiguration, configuration, setSesionInvalid } =
    React.useContext(UseContext);

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

  const [initialForm, setInitialForm] = React.useState({
    semester: "",
    start_date: null,
    end_date: null,
    campus_id: user?.id,
    campus_name: user?.name,
    investigacion: "",
    extension: "",
    oaca: "",
    oda: "",
    title: "",
    tc_hours: 0,
    mt_hours: 0,
  });

  let type = "post";
  let call = APIconfiguracion.createConfiguration;

  const {
    form,
    setForm,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialForm, ConfigurationValidation, call, type);

  const handleChangeActivityResponsible = async (actualConfiguration) => {
    try {
      const searchResponse = await APIactivity.getAll(
        user?.name,
        configuration?.semester
      );

      if (searchResponse.status === 200) {
        const activities = searchResponse.data.activities;

        for (const activity of activities) {
          if (activity.convention === "Investigación") {
            activity.responsible = actualConfiguration?.investigacion;
          } else if (activity.convention === "Extensión") {
            activity.responsible = actualConfiguration?.extension;
          } else if (activity.convention === "Procesos OACA") {
            activity.responsible = actualConfiguration?.oaca;
          } else if (activity.convention === "Procesos ODA") {
            activity.responsible = actualConfiguration?.oda;
          }

          await APIactivity.updateActivity(activity.id, activity);
        }
      }
    } catch (error) {
      setMessage("Error al actualizar las actividades");
      setCode("error");
      handleClick();
    }
  };

  React.useEffect(() => {
    if (response?.status === 200) {
      const actualConfiguration = response.data.configurations;
      const StringConfiguration = JSON.stringify(actualConfiguration);
      localStorage.setItem("Configuration", StringConfiguration);
      setConfiguration(actualConfiguration);
      setMessage("Configuración guardada correctamente");
      setCode("success");
      handleClick();
      handleChangeActivityResponsible(actualConfiguration);
    }

    if (response?.status === 401) {
      setSesionInvalid(true);
    }

    if (response?.status === "error") {
      setMessage("Todos los campos son obligatorios");
      setCode("error");
      handleClick();
    }
  }, [response]);

  const fetchConfiguration = async () => {
    setForm({
      semester: configuration?.semester,
      campus_id: user?.id,
      campus_name: user?.name,
      start_date: configuration?.start_date || null,
      end_date: configuration?.end_date || null,
      investigacion: configuration?.investigacion,
      extension: configuration?.extension,
      oaca: configuration?.oaca,
      oda: configuration?.oda,
      title: configuration?.title,
      tc_hours: configuration?.tc_hours,
      mt_hours: configuration?.mt_hours,
    });
  };

  React.useEffect(() => {
    fetchConfiguration();
  }, [configuration]);

  return (
    <div className="table-form">
      <Grid xs={12}>
        <div className="title-finish">Configuración del campus</div>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={3} columnSpacing={1}>
          <Grid xs={12}>
            <div className="subtitle-form">Configuración semestral</div>
          </Grid>

          <ThemeProvider theme={theme}>
            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Semestre"
                size="small"
                fullWidth
                name="semester"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.semester || ""}
                error={errors?.states.semester}
                helperText={errors?.messages.semester}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <DatePicker
                label="Inicio de semestre"
                value={form.start_date === null ? null : dayjs(form.start_date)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: errors?.states.start_date,
                    helperText: errors?.messages.start_date,
                    onBlur: () =>
                      handleBlur({
                        target: { name: "start_date", type: "date" },
                      }),
                  },
                }}
                onChange={(date) =>
                  handleChange({
                    target: {
                      name: "start_date",
                      value: date,
                      type: "date",
                    },
                  })
                }
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <DatePicker
                label="Final de semestre"
                value={form.end_date === null ? null : dayjs(form.end_date)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: errors?.states.end_date,
                    helperText: errors?.messages.end_date,
                    onBlur: () =>
                      handleBlur({
                        target: { name: "end_date", type: "date" },
                      }),
                  },
                }}
                onChange={(date) =>
                  handleChange({
                    target: {
                      name: "end_date",
                      value: date,
                      type: "date",
                    },
                  })
                }
              />
            </Grid>

            <Grid xs={12}>
              <div className="subtitle-form">Configuración laboral</div>
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Horas docente carrera y tiempo completo"
                size="small"
                type="number"
                fullWidth
                name="tc_hours"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.tc_hours || ""}
                error={errors?.states.tc_hours}
                helperText={errors?.messages.tc_hours}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Horas docente medio tiempo"
                size="small"
                type="number"
                fullWidth
                name="mt_hours"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.mt_hours || ""}
                error={errors?.states.mt_hours}
                helperText={errors?.messages.mt_hours}
              />
            </Grid>

            <Grid xs={12}>
              <div className="subtitle-form">Configuración de responsables</div>
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Investigación"
                size="small"
                fullWidth
                name="investigacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.investigacion || ""}
                error={errors?.states.investigacion}
                helperText={errors?.messages.investigacion}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Extensión"
                size="small"
                fullWidth
                name="extension"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.extension || ""}
                error={errors?.states.extension}
                helperText={errors?.messages.extension}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="OACA"
                size="small"
                fullWidth
                name="oaca"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.oaca || ""}
                error={errors?.states.oaca}
                helperText={errors?.messages.oaca}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="ODA"
                size="small"
                fullWidth
                name="oda"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.oda || ""}
                error={errors?.states.oda}
                helperText={errors?.messages.oda}
              />
            </Grid>

            <Grid xs={12}>
              <div className="subtitle-form">
                Configuración de formato acumulado
              </div>
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Titulo del formato"
                size="small"
                fullWidth
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.title || ""}
                error={errors?.states.title}
                helperText={errors?.messages.title}
              />
            </Grid>

            <Grid xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Guardar configuración"
                )}
              </Button>
            </Grid>
          </ThemeProvider>
        </Grid>
      </form>

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
    </div>
  );
}
