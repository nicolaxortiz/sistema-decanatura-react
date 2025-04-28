import React, { useCallback } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import { useForm } from "../hooks/UseForms.js";
import CircularProgress from "@mui/material/CircularProgress";
import { UseContext } from "../context/UseContext.js";
import { ConfigurationValidation } from "../validations/ConfigurationValidation.js";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import * as APIconfiguracion from "../API/ConfigurationCall.js";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
    docencia: "",
    investigacion: "",
    extension: "",
    oaca: "",
    oda: "",
    comites: "",
    otras: "",
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

  React.useEffect(() => {
    if (response?.status === 200) {
      const actualConfiguration = response.data.configurations;
      const StringConfiguration = JSON.stringify(actualConfiguration);
      localStorage.setItem("Configuration", StringConfiguration);
      setConfiguration(actualConfiguration);
      setMessage("Configuración guardada correctamente");
      setCode("success");
      handleClick();
    }

    if (response?.status === 401) {
      setSesionInvalid(true);
    }

    if (response?.status === "error") {
      setMessage("Error al guardar la configuración");
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
      docencia: configuration?.docencia,
      investigacion: configuration?.investigacion,
      extension: configuration?.extension,
      oaca: configuration?.oaca,
      oda: configuration?.oda,
      comites: configuration?.comites,
      otras: configuration?.otras,
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
                label="Horas docente planta y tiempo completo"
                size="small"
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
                label="Docencia"
                size="small"
                fullWidth
                name="docencia"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.docencia || ""}
                error={errors?.states.docencia}
                helperText={errors?.messages.docencia}
              />
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

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Comités"
                size="small"
                fullWidth
                name="comites"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.comites || ""}
                error={errors?.states.comites}
                helperText={errors?.messages.comites}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6} lg={6}>
              <TextField
                label="Otras"
                size="small"
                fullWidth
                name="otras"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form?.otras || ""}
                error={errors?.states.otras}
                helperText={errors?.messages.otras}
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
    </div>
  );
}
