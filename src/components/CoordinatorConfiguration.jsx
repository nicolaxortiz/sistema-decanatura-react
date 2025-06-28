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
import { UseContext } from "../context/UseContext.js";
import { theme } from "../resources/theme.js";
import { useForm } from "../hooks/UseForms.js";
import * as APIcoordinator from "../API/CoordinatorCall.js";
import { CoordinatorValidation } from "../validations/CoordinatorValidation.js";
import defaultSignature from "../resources/defaultSignature.png";

export default function CoordinatorConfiguration() {
  const APIURL = process.env.REACT_APP_API_URL;
  const { user, setUser, setSesionInvalid } = React.useContext(UseContext);
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
    id: "",
    document: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [previewSignature, setPreviewSignature] =
    React.useState(defaultSignature);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setPreviewSignature(imageUrl);
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

    return { getSignature };
  };

  const fetchData = async () => {
    const { getSignature } = await getImages();

    setForm({
      id: user?.id,
      document: user?.document,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      signature: getSignature,
    });
  };

  React.useEffect(() => {
    const updateForm = async () => {
      await fetchData();
    };

    if (user) updateForm();
  }, [user]);

  const call = APIcoordinator.updateCoordinator;
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
  } = useForm(initialForm, CoordinatorValidation, call, type);

  React.useEffect(() => {
    if (response?.status === 200) {
      const actualCoordinator = response.data.updatedCoordinator;
      const StringCoordinator = JSON.stringify(actualCoordinator);
      localStorage.setItem("User", StringCoordinator);
      setUser(actualCoordinator);
      setMessage("Datos guardados correctamente ");
      setCode("success");
      handleClick();
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
        <Grid container sx={{ pt: 1 }}>
          <Grid xs={12}>
            <div className="title-finish">Perfil coordinador</div>
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={1}>
            <ThemeProvider theme={theme}>
              <Grid xs={12}>
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
                  disabled
                  fullWidth
                  type="number"
                  name="document"
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

              <Grid xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </Grid>
            </ThemeProvider>
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
