import React from "react";
import "../styles/personalForm.css";
import defaultProfile from "../resources/defaulProfile.png";
import defaultSignature from "../resources/defaultSignature.png";
import { UseContext } from "../context/UseContext.js";
import Grid from "@mui/material/Unstable_Grid2";
import {
  TextField,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
  Autocomplete,
  ThemeProvider,
} from "@mui/material";
import { theme } from "../resources/theme.js";
import { useForm } from "../hooks/UseForms.js";
import { TeacherValidation } from "../validations/TeacherValidation.js";
import * as APIdocentes from "../API/TeacherCall.js";
import * as camposBucaramanga from "../resources/bucaramanga.js";
import * as camposVelez from "../resources/vélez.js";
import * as camposBarrancabermeja from "../resources/barrancabermeja.js";
import * as camposPiedecuesta from "../resources/piedecuesta.js";
import * as camposVirtual from "../resources/virtual.js";

export default function PersonalForm() {
  const APIURL = process.env.REACT_APP_API_URL;
  const { setUser, user, configuration, setSesionInvalid, setTab } =
    React.useContext(UseContext);
  const [campos, setCampos] = React.useState(null);

  const [initialForm, setInitialForm] = React.useState({
    id: "",
    document: "",
    last_name: "",
    first_name: "",
    address: "",
    phone: "",
    email: "",
    card: "",
    faculty: "",
    employment_type: "",
    rank: "",
    undergraduate: "",
    specialization: "",
    master: "",
    doctorate: "",
    photo: null,
    signature: null,
  });

  const [previewPhoto, setPreviewPhoto] = React.useState(defaultProfile);
  const [previewSignature, setPreviewSignature] =
    React.useState(defaultSignature);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      if (event.target.name === "photo") {
        setPreviewPhoto(imageUrl);
      } else {
        setPreviewSignature(imageUrl);
      }
    }
    handleChange(event);
  };

  const isValidImageUrl = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const getImages = async () => {
    const getPhoto = await isValidImageUrl(
      `${APIURL}/api/images/${user?.document}foto.jpg?v=${new Date().getTime()}`
    ).then((isValid) => {
      return isValid;
    });

    if (getPhoto) {
      setPreviewPhoto(
        `${APIURL}/api/images/${
          user?.document
        }foto.jpg?v=${new Date().getTime()}`
      );
    }

    const getSignature = await isValidImageUrl(
      `${APIURL}/api/images/${
        user?.document
      }firma.jpg?v=${new Date().getTime()}`
    ).then((isValid) => {
      return isValid;
    });

    if (getSignature) {
      setPreviewSignature(
        `${APIURL}/api/images/${
          user?.document
        }firma.jpg?v=${new Date().getTime()}`
      );
    }

    return { getPhoto, getSignature };
  };

  const fetchData = async () => {
    const { getPhoto, getSignature } = await getImages();

    setForm({
      id: user?.id,
      document: user?.document,
      photo: getPhoto,
      signature: getSignature,
      last_name: user?.last_name,
      first_name: user?.first_name,
      address: user?.address,
      phone: user?.phone,
      email: user?.email,
      card: user?.card,
      faculty: user?.faculty,
      employment_type: user?.employment_type,
      rank: user?.rank,
      undergraduate: user?.undergraduate,
      specialization: user?.specialization,
      master: user?.master,
      doctorate: user?.doctorate,
    });
  };

  React.useEffect(() => {
    const updateForm = async () => {
      await fetchData();
    };

    if (user) updateForm();
  }, [user]);

  React.useEffect(() => {
    if (configuration?.information === "bucaramanga.js") {
      setCampos(camposBucaramanga);
    } else if (configuration?.information === "vélez.js") {
      setCampos(camposVelez);
    } else if (configuration?.information === "piedecuesta.js") {
      setCampos(camposPiedecuesta);
    } else if (configuration?.information === "barrancabermeja.js") {
      setCampos(camposBarrancabermeja);
    } else if (configuration?.information === "virtual.js") {
      setCampos(camposVirtual);
    }
  }, [configuration]);

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
      const actualTeacher = response.data.updatedTeacher;
      const StringTeacher = JSON.stringify(actualTeacher);
      localStorage.setItem("User", StringTeacher);
      setUser(actualTeacher);
      setTab(2);
    }
    if (response?.status === 401) {
      setSesionInvalid(true);
    }

    if (response?.status === "error") {
      setMessage("Revise los campos obligatorios");
      setCode("warning");
      handleClick();
    }
  }, [response]);

  return (
    <>
      <div className="form-box">
        <Grid container>
          <Grid xs={12}>
            <div className="title-finish">Información Personal</div>
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
                      src={previewPhoto}
                      alt={"Foto personal"}
                      className="personalImg-form"
                    />
                  </Grid>
                  <Grid xs={12} className="center-grid">
                    <Button
                      variant="contained"
                      component="label"
                      color={errors?.states.photo ? "alert" : "primary"}
                      size="small"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        name="photo"
                        onBlur={handleBlur}
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <div className="form-errors">{errors?.messages.photo}</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Grid container>
                  <Grid xs={12} className="center-grid">
                    <img
                      src={previewSignature}
                      alt="Firma personal"
                      className="signatureImg-form"
                    />
                  </Grid>
                  <Grid xs={12} className="center-grid">
                    <Button
                      variant="contained"
                      component="label"
                      color={errors?.states.signature ? "alert" : "primary"}
                      size="small"
                    >
                      <input
                        type="file"
                        name="signature"
                        accept="image/*"
                        onBlur={handleBlur}
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <div className="form-errors">{errors?.messages.signature}</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Documento"
                  size="small"
                  fullWidth
                  type="number"
                  name="document"
                  disabled
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.document || ""}
                  error={errors?.states.document}
                  helperText={errors?.messages.document}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Apellidos"
                  size="small"
                  fullWidth
                  name="last_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.last_name || ""}
                  error={errors?.states.last_name}
                  helperText={errors?.messages.last_name}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Nombres"
                  size="small"
                  fullWidth
                  name="first_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.first_name || ""}
                  error={errors?.states.first_name}
                  helperText={errors?.messages.first_name}
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Dirección"
                  size="small"
                  fullWidth
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.address || ""}
                  error={errors?.states.address}
                  helperText={errors?.messages.address}
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
                  value={form?.phone || ""}
                  error={errors?.states.phone}
                  helperText={errors?.messages.phone}
                  name="phone"
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Correo electrónico"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.email || ""}
                  error={errors?.states.email}
                  helperText={errors?.messages.email}
                  name="email"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Tarjeta profesional"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.card || ""}
                  error={errors?.states.card}
                  helperText={errors?.messages.card}
                  name="card"
                />
              </Grid>

              <Grid xs={12}>
                <div className="subtitle-form">Datos laborales</div>
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Campus"
                  size="small"
                  fullWidth
                  value={configuration?.campus_name || ""}
                  name="campus"
                  disabled
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={campos?.Facultades || []}
                  value={form?.faculty || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Facultad"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.faculty}
                      helperText={errors?.messages.faculty}
                      name="faculty"
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Unidad académica"
                  size="small"
                  fullWidth
                  value={configuration?.program_name || ""}
                  name="campus"
                  disabled
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={campos?.TipoDeContrato || []}
                  value={form?.employment_type || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de vinculación"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.employment_type}
                      helperText={errors?.messages.employment_type}
                      name="employment_type"
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={campos?.Escalafon || []}
                  value={form?.rank || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categoría docente"
                      size="small"
                      fullWidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={errors?.states.rank}
                      helperText={errors?.messages.rank}
                      name="rank"
                    />
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <div className="subtitle-form">Datos Académicos</div>
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Pregrado"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.undergraduate || ""}
                  error={errors?.states.undergraduate}
                  helperText={errors?.messages.undergraduate}
                  name="undergraduate"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Especialización"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.specialization || ""}
                  error={errors?.states.specialization}
                  helperText={errors?.messages.specialization}
                  name="specialization"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Magister"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.master || ""}
                  error={errors?.states.master}
                  helperText={errors?.messages.master}
                  name="master"
                />
              </Grid>

              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Doctorado"
                  size="small"
                  fullWidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form?.doctorate || ""}
                  error={errors?.states.doctorate}
                  helperText={errors?.messages.doctorate}
                  name="doctorate"
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
