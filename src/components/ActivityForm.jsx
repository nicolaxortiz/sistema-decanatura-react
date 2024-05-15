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
import Autocomplete from "@mui/material/Autocomplete";
import { Actividades, Asignaturas, Grupos } from "../resources/campos.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ActivityForm() {
  const { actividades, setActividades, user, setIsFirstActivity } =
    React.useContext(UseContext);
  const [initialForm, setInitialForm] = React.useState({
    nombre: "",
    misional: "",
    convencion: "",
    descripcion: "",
    grupo: "",
    horas: "",
    responsable: "Ing Yezid Yair García",
    producto: {
      descripcion: "",
    },
  });

  const [misionalIndex, setMisionalIndex] = React.useState();
  const [descripcion, setDescripcion] = React.useState("");

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

  const arrayNombres = Actividades.map((actividad) => actividad.nombre);
  const arrayMisionales = Actividades.map((actividad) => actividad.misional);
  const arrayProducto = Actividades.map((actividad) => actividad.producto);
  const arrayConvencion = Actividades.map((actividad) => actividad.convencion);

  const handleChangeName = async (event) => {
    if (!event.target.textContent) {
      setMisionalIndex();
    } else {
      const indice = arrayNombres.indexOf(event.target.textContent);
      setMisionalIndex(indice);
    }
  };

  React.useEffect(() => {
    setDescripcion("");
    if (Actividades[misionalIndex]?.descripcion) {
      setDescripcion(Actividades[misionalIndex].descripcion);
      setForm({
        ...form,
        descripcion: Actividades[misionalIndex].descripcion,
        misional: arrayMisionales[misionalIndex] || "",
        convencion: arrayConvencion[misionalIndex] || "",
        producto: { descripcion: arrayProducto[misionalIndex] || "" },
      });
    } else {
      setDescripcion("");
      setForm({
        ...form,
        descripcion: "",
        misional: arrayMisionales[misionalIndex] || "",
        convencion: arrayConvencion[misionalIndex] || "",
        producto: { descripcion: arrayProducto[misionalIndex] || "" },
      });
    }
  }, [misionalIndex]);

  const call = APIactividades.saveActivitys;
  const type = "saveLocal";

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

  React.useEffect(() => {
    if (response === 200) {
      setActividades((prevState) => ({
        ...prevState,
        actividad: [...prevState.actividad, form],
      }));

      setForm(initialForm);
      setDescripcion("");
      setMisionalIndex();
      setMessage("Actividad agregada correctamente");
      setCode("success");
      handleClick();
    }
  }, [loading]);

  React.useEffect(() => {
    if (response === 200) {
      localStorage.setItem("Activity", JSON.stringify(actividades));
    }
  }, [actividades, response]);

  React.useEffect(() => {
    if (user?._id != undefined) {
      const fetchData = async () => {
        try {
          const responseData = await APIactividades.getbyIdDocenteAndSemester(
            user?._id
          );

          if (responseData.status === 200) {
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
          }
        } catch (error) {
          if (!!actividades) {
            const dataStr = localStorage.getItem("Activity");
            const data = JSON.parse(dataStr);
            if (data) {
              setActividades(data);
            } else {
              localStorage.setItem("Activity", JSON.stringify(actividades));
            }
          }
        }
      };

      fetchData();
    }
  }, [user]);

  return (
    <>
      <div className="form-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-form">Nueva actividad</div>
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
                  value={form?.nombre || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nombre"
                      name="nombre"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.nombre}
                      helperText={errors?.messages.nombre}
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
                  readOnly
                  name="misional"
                  value={arrayMisionales[misionalIndex] || ""}
                  onBlur={handleBlur}
                  error={errors?.states.misional}
                  helperText={errors?.messages.misional}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                {!!descripcion ? (
                  <TextField
                    label="Descripción"
                    size="small"
                    fullWidth
                    name="descripcion"
                    onBlur={handleBlur}
                    value={descripcion}
                    onChange={handleChange}
                    error={errors?.states.descripcion}
                    helperText={errors?.messages.descripcion}
                    readOnly
                  />
                ) : (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={Asignaturas}
                    value={form?.descripcion}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Descripción"
                        name="descripcion"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={errors?.states.descripcion}
                        helperText={errors?.messages.descripcion}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                {!descripcion && (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={form?.grupo}
                    options={Grupos}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Grupo"
                        name="grupo"
                        size="small"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={errors?.states.grupo}
                        helperText={errors?.messages.grupo}
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
                  name="horas"
                  onBlur={handleBlur}
                  value={form?.horas}
                  onChange={handleChange}
                  error={errors?.states.horas}
                  helperText={errors?.messages.horas}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Responsable"
                  size="small"
                  fullWidth
                  defaultValue={"Ing Yezid Yair García"}
                  name="responsable"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors?.states.responsable}
                  helperText={errors?.messages.responsable}
                />
              </Grid>

              <Grid xs={12}>
                <Button variant="contained" type="submit" fullWidth>
                  Guardar
                </Button>
              </Grid>
            </ThemeProvider>

            <Grid xs={4}></Grid>
            <Grid xs={8}></Grid>
          </Grid>
        </form>
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
