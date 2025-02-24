import React from "react";
import "../styles/personalForm.css";
import defaultProfile from "../resources/defaulProfile.png";
import defaultSignature from "../resources/defaultSignature.png";
import { UseContext } from "../context/UseContext.js";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Button from "@mui/material/Button";
import { useForm } from "../hooks/UseForms.js";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { TeacherValidation } from "../validations/TeacherValidation.js";
import * as APIdocentes from "../API/TeacherCall.js";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Facultades,
  UnidadAcademica,
  Sedes,
  TipoDeContrato,
  Escalafon,
} from "../resources/campos.js";

export default function PersonalForm() {
  const navigate = useNavigate();
  const { setUser, user, tab, progItems, setProgItems } =
    React.useContext(UseContext);
  const [loadingButton, setLoadingButton] = React.useState(false);
  const [initialForm, setInitialForm] = React.useState({
    _id: "",
    documento: "",
    apellidos: "",
    nombres: "",
    tarjeta: "",
    facultad: "",
    unidadAcademica: "",
    campus: "",
    foto: "",
    firma: "",
    vinculacion: "",
    escalafon: "",
    direccion: "",
    celular: 0,
    correo: "",
    pregrado: "",
    especializacion: "",
    magister: "",
    doctorado: "",
  });

  React.useEffect(() => {
    console.log("intento");
    console.log(user);

    const fetchData = async () => {
      setForm({
        _id: user?._id,
        documento: user?.documento,
        apellidos: user?.apellidos,
        nombres: user?.nombres,
        tarjeta: user?.tarjeta,
        facultad: user?.facultad,
        unidadAcademica: user?.unidadAcademica,
        foto: user?.foto,
        firma: user?.firma,
        campus: user?.campus,
        vinculacion: user?.vinculacion,
        escalafon: user?.escalafon,
        direccion: user?.direccion,
        celular: user?.celular,
        correo: user?.correo,
        pregrado: user?.pregrado,
        especializacion: user?.especializacion,
        magister: user?.magister,
        doctorado: user?.doctorado,
      });
    };

    fetchData();
  }, [user]);

  const call = APIdocentes.updateTeacher;
  const type = "put";

  const {
    form,
    setForm,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialForm, TeacherValidation, call, type);

  React.useEffect(() => {
    if (response?.status === 200) {
      const actualTeacher = response.data.updateTeacher;
      const StringTeacher = JSON.stringify(actualTeacher);
      localStorage.setItem("User", StringTeacher);
      setUser(actualTeacher);
      navigate("/activity");
    }
  }, [response]);

  return (
    <>
      <div className="form-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-form">Información Personal</div>
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={1}>
            <ThemeProvider theme={theme}>
              <Grid xs={12}>
                <div className="subtitle-form">Datos personales</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Grid container>
                  <Grid xs={12} className="center-grid">
                    <img
                      src={user?.foto || defaultProfile}
                      alt={"Foto personal"}
                      className="personalImg-form"
                    />
                  </Grid>
                  <Grid xs={12} className="center-grid">
                    <Button
                      variant="contained"
                      component="label"
                      color={errors?.states.foto ? "alert" : "primary"}
                      size="small"
                    >
                      <input
                        type="file"
                        name="foto"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <div className="form-errors">{errors?.messages.foto}</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Grid container>
                  <Grid xs={12} className="center-grid">
                    <img
                      src={user?.firma || defaultSignature}
                      alt="Firma personal"
                      className="signatureImg-form"
                    />
                  </Grid>
                  <Grid xs={12} className="center-grid">
                    <Button
                      variant="contained"
                      component="label"
                      color={errors?.states.firma ? "alert" : "primary"}
                      size="small"
                    >
                      <input
                        type="file"
                        name="firma"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <div className="form-errors">{errors?.messages.firma}</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Documento"
                  size="small"
                  fullWidth
                  type="number"
                  name="documento"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.documento || ""}
                  error={errors?.states.documento}
                  helperText={errors?.messages.documento}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Apellidos"
                  size="small"
                  fullWidth
                  name="apellidos"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.apellidos || ""}
                  error={errors?.states.apellidos}
                  helperText={errors?.messages.apellidos}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Nombres"
                  size="small"
                  fullWidth
                  name="nombres"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.nombres || ""}
                  error={errors?.states.nombres}
                  helperText={errors?.messages.nombres}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Direccion"
                  size="small"
                  fullWidth
                  name="direccion"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.direccion || ""}
                  error={errors?.states.direccion}
                  helperText={errors?.messages.direccion}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Celular"
                  size="small"
                  fullWidth
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.celular || ""}
                  error={errors?.states.celular}
                  helperText={errors?.messages.celular}
                  name="celular"
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Correo electronico"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.correo || ""}
                  error={errors?.states.correo}
                  helperText={errors?.messages.correo}
                  name="correo"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Tarjeta profesional"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.tarjeta || ""}
                  error={errors?.states.tarjeta}
                  helperText={errors?.messages.tarjeta}
                  name="tarjeta"
                />
              </Grid>

              <Grid xs={12}>
                <div className="subtitle-form">Datos laborales</div>
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Sedes}
                  value={form?.campus || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Campus"
                      name="campus"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.campus}
                      helperText={errors?.messages.campus}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Facultades}
                  value={form?.facultad || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Facultad"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.facultad}
                      helperText={errors?.messages.facultad}
                      name="facultad"
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={UnidadAcademica}
                  value={form?.unidadAcademica || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unidad academica"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.unidadAcademica}
                      helperText={errors?.messages.unidadAcademica}
                      name="unidadAcademica"
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={TipoDeContrato}
                  value={form?.vinculacion || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de vinculacion"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.vinculacion}
                      helperText={errors?.messages.vinculacion}
                      name="vinculacion"
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Escalafon}
                  value={form?.escalafon || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Escalafon"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.escalafon}
                      helperText={errors?.messages.escalafon}
                      name="escalafon"
                    />
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <div className="subtitle-form">Datos Academicos</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Pregrado"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.pregrado || ""}
                  error={errors?.states.pregrado}
                  helperText={errors?.messages.pregrado}
                  name="pregrado"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Especializacion"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.especializacion || ""}
                  error={errors?.states.especializacion}
                  helperText={errors?.messages.especializacion}
                  name="especializacion"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Magister"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.magister || ""}
                  error={errors?.states.magister}
                  helperText={errors?.messages.magister}
                  name="magister"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Doctorado"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.doctorado || ""}
                  error={errors?.states.doctorado}
                  helperText={errors?.messages.doctorado}
                  name="doctorado"
                />
              </Grid>
              <Grid xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </Grid>
            </ThemeProvider>
            <Grid xs={4}></Grid>
            <Grid xs={8}></Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}
