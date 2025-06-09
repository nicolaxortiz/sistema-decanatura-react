import React from "react";
import "../styles/personalForm.css";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { UseContext } from "../context/UseContext.js";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import { useForm } from "../hooks/UseForms.js";
import { ActivityValidation } from "../validations/ActivityValidation.js";
import * as APIactividades from "../API/ActivityCall.js";
import * as APIprogram from "../API/ProgramCall.js";
import Autocomplete from "@mui/material/Autocomplete";
import * as camposBucaramanga from "../resources/bucaramanga.js";
import * as camposVelez from "../resources/velez.js";
import * as camposBarranca from "../resources/velez.js";
import * as camposPiedecuesta from "../resources/velez.js";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function ActivityForm() {
  const [campos, setCampos] = React.useState(null);
  const [arrayNombres, setArrayNombres] = React.useState([]);
  const [coordinator, setCoordinator] = React.useState(null);
  const { activities, setActivities, user, configuration, setSesionInvalid } =
    React.useContext(UseContext);
  const [initialForm, setInitialForm] = React.useState({
    teacher_id: "",
    semester: "",
    name: "",
    mission: "",
    convention: "",
    description: "",
    group_name: "",
    hours: "",
    responsible: "",
    product: {
      description: "",
    },
    consolidated: "",
  });

  const [misionalIndex, setMisionalIndex] = React.useState();
  const [defaultDescription, setDefaultDescription] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");

  const [responsibles, setResponsibles] = React.useState({});

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleChangeName = async (event) => {
    setForm({
      ...form,
      semester: configuration?.semester,
      teacher_id: user?.id,
    });

    if (!event.target.textContent) {
      setMisionalIndex();
    } else {
      const indice = arrayNombres.indexOf(event.target.textContent);
      setMisionalIndex(indice);
    }
  };

  React.useEffect(() => {
    setDefaultDescription("");
    if (campos?.Actividades[misionalIndex]?.description) {
      setDefaultDescription(campos?.Actividades[misionalIndex].description);
      setForm({
        ...form,
        description: campos?.Actividades[misionalIndex]?.description,
        mission: campos?.Actividades[misionalIndex]?.mission || "",
        convention: campos?.Actividades[misionalIndex]?.convention || "",
        product: {
          description: campos?.Actividades[misionalIndex]?.product || "",
        },
        consolidated: campos?.Actividades[misionalIndex]?.consolidated || "",
        responsible:
          responsibles[
            campos?.Actividades[misionalIndex]?.convention.replace(/\s+/g, "")
          ] || "",
      });
    } else {
      setDefaultDescription("");
      setForm({
        ...form,
        description: "",
        mission: campos?.Actividades[misionalIndex]?.mission || "",
        convention: campos?.Actividades[misionalIndex]?.convention || "",
        product: {
          description: campos?.Actividades[misionalIndex]?.product || "",
        },
        consolidated: campos?.Actividades[misionalIndex]?.consolidated || "",
        responsible:
          responsibles[
            campos?.Actividades[misionalIndex]?.convention.replace(/\s+/g, "")
          ] || "",
      });
    }
  }, [misionalIndex]);

  const call = APIactividades.saveActivitys;
  const type = "post";

  const {
    form,
    setForm,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialForm, ActivityValidation, call, type);

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
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
        const dataStr = localStorage.getItem("Activity");
        const data = JSON.parse(dataStr);
        if (data?.activities.length > 0) {
          setActivities(data);
        }
      }
    }
  };

  React.useEffect(() => {
    if (response?.status === 200) {
      fetchData();

      setForm(initialForm);
      setDefaultDescription("");
      setMisionalIndex();
      setMessage("Actividad agregada correctamente");
      setCode("success");
      handleClick();
    }

    if (response?.status === 401) {
      setSesionInvalid(true);
    }
  }, [response]);

  const fetchProgramData = async () => {
    try {
      const responseProgram = await APIprogram.getById(user?.program_id);

      if (responseProgram.status === 200) {
        setCoordinator(
          responseProgram.data.program.coordinator_first_name +
            " " +
            responseProgram.data.program.coordinator_last_name
        );
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
        setMessage(
          "No se encontró el responsable de la actividad, por favor intente más tarde."
        );
        setCode("error");
        handleClick();
      }
    }
  };

  React.useEffect(() => {
    if (user?.id != undefined) {
      fetchData();
      fetchProgramData();

      if (!user?.employment_type) {
        setMessage(
          "Debe ingresar sus datos personales para registrar actividades"
        );
        setCode("warning");
        handleClick();
      }
    }
  }, [user]);

  React.useEffect(() => {
    setResponsibles({
      Docenciadirecta: coordinator,
      Investigación: configuration?.investigacion,
      Extensión: configuration?.extension,
      ProcesosOACA: configuration?.oaca,
      ProcesosODA: configuration?.oda,
      Comités: coordinator,
      Otras: coordinator,
    });

    if (configuration?.information === "bucaramanga.js") {
      setCampos(camposBucaramanga);
      setArrayNombres(
        camposBucaramanga.Actividades.map((actividad) => actividad.name)
      );
    } else if (configuration?.information === "velez.js") {
      setCampos(camposVelez);
      setArrayNombres(
        camposVelez.Actividades.map((actividad) => actividad.name)
      );
    } else if (configuration?.information === "piedecuesta.js") {
      setCampos(camposPiedecuesta);
      setArrayNombres(
        camposPiedecuesta.Actividades.map((actividad) => actividad.name)
      );
    } else if (configuration?.information === "barranca.js") {
      setCampos(camposBarranca);
      setArrayNombres(
        camposBarranca.Actividades.map((actividad) => actividad.name)
      );
    }
  }, [configuration, coordinator]);

  return (
    <>
      <div className="form-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-finish">Nueva actividad</div>
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={1}>
            <ThemeProvider theme={theme}>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={arrayNombres}
                  disabled={loading || !user?.employment_type}
                  value={form?.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nombre"
                      name="name"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.name}
                      helperText={errors?.messages.name}
                    />
                  )}
                  onChange={(e) => {
                    handleChangeName(e);
                  }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Misional"
                  size="small"
                  fullWidth
                  disabled
                  name="mission"
                  value={campos?.Actividades[misionalIndex]?.mission || ""}
                  onBlur={handleBlur}
                  error={errors?.states.mission}
                  helperText={errors?.messages.mission}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                {!!defaultDescription ? (
                  <TextField
                    label="Descripción"
                    size="small"
                    fullWidth
                    name="description"
                    disabled={loading || !user?.employment_type}
                    onBlur={handleBlur}
                    value={defaultDescription}
                    onChange={handleChange}
                    error={errors?.states.description}
                    helperText={errors?.messages.description}
                    readOnly
                  />
                ) : (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={campos?.Asignaturas || []}
                    disabled={loading || !user?.employment_type}
                    value={form?.description}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Descripción"
                        name="description"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={errors?.states.description}
                        helperText={errors?.messages.description}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                {!defaultDescription && (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    disabled={loading || !user?.employment_type}
                    value={form?.group_name}
                    options={campos?.Grupos || []}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Grupo"
                        name="group_name"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={errors?.states.group_name}
                        helperText={errors?.messages.group_name}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Horas"
                  size="small"
                  fullWidth
                  type="number"
                  name="hours"
                  disabled={loading || !user?.employment_type}
                  onBlur={handleBlur}
                  value={form?.hours}
                  onChange={handleChange}
                  error={errors?.states.hours}
                  helperText={errors?.messages.hours}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Responsable"
                  disabled
                  size="small"
                  fullWidth
                  value={form?.responsible}
                  name="responsible"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Grid>

              <Grid xs={12}>
                <Button
                  variant="contained"
                  disabled={loading || !user?.employment_type}
                  type="submit"
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </Grid>
            </ThemeProvider>

            <Grid xs={4}></Grid>
            <Grid xs={8}></Grid>
          </Grid>
        </form>
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
