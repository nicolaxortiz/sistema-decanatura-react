import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { theme } from "../resources/theme.js";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as APIdean from "../API/DeanCall.js";
import EditIcon from "@mui/icons-material/Edit";
import { UseContext } from "../context/UseContext.js";
import * as camposBucaramanga from "../resources/bucaramanga.js";
import * as camposVelez from "../resources/velez.js";
import * as camposBarranca from "../resources/velez.js";
import * as camposPiedecuesta from "../resources/velez.js";

export default function AllDeans() {
  const { user, setSesionInvalid, configuration } =
    React.useContext(UseContext);
  const [deanData, setDeanData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [selectedDean, setSelectedDean] = React.useState();
  const [formOption, setFormOption] = React.useState();
  const [totalPages, setTotalPages] = React.useState(0);
  const [actualPage, setActualPage] = React.useState(1);
  const [totalDean, setTotalDean] = React.useState(0);
  const [campos, setCampos] = React.useState(null);

  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDean();
  };

  const handleDean = async (form) => {
    setLoading(true);

    if (formOption === "post") {
      try {
        const response = await APIdean.postDean(form);

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Decano creado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        if (error.response.status === 401) {
          setSesionInvalid(true);
        } else if (error.response.status === 409) {
          setLoading(false);
          setMessage("Ya existe un decano con ese documento, email o facultad");
          setCode("error");
          handleClick();
        } else {
          setLoading(false);
          setMessage("Error al guardar, inténtelo nuevamente");
          setCode("error");
          handleClick();
        }
      }
    } else {
      try {
        const response = await APIdean.updateDean(selectedDean?.id, form);

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Decano actualizado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        if (error.response.status === 401) {
          setSesionInvalid(true);
        } else if (error.response.status === 409) {
          setLoading(false);
          setMessage("Ya existe un decano con ese documento, email o facultad");
          setCode("error");
          handleClick();
        } else {
          setLoading(false);
          setMessage("Error al actualizar, inténtelo nuevamente");
          setCode("error");
          handleClick();
        }
      }
    }
  };

  const handleChangePage = (event, value) => {
    setActualPage(value);
  };

  const fetchData = async () => {
    try {
      const response = await APIdean.getByCampusId(user?.id, actualPage);
      if (response.status === 200) {
        setDeanData(response.data.deans);
        setTotalPages(Math.ceil(response.data.count / 8));
        setTotalDean(response.data.count);
      }
    } catch (error) {
      setDeanData();
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron decanos");
        setCode("error");
        handleClick();
      } else {
        handleClose();
        setMessage("Error al traer los datos, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [user, loading, actualPage]);

  React.useEffect(() => {
    if (user?.name === "Bucaramanga") {
      setCampos(camposBucaramanga);
    } else if (user?.name === "Vélez") {
      setCampos(camposVelez);
    } else if (user?.name === "Piedecuesta") {
      setCampos(camposPiedecuesta);
    } else if (user?.name === "Barrancabermeja") {
      setCampos(camposBarranca);
    }
  }, [user]);
  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">Listado de Decanos</div>
        </Grid>

        <Grid xs={12} sx={{ marginLeft: 2 }}>
          <p>Número total de decanos: {totalDean}</p>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Decano</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell>Facultad</TableCell>
                <TableCell align="center">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deanData?.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {`${item.first_name} ${item.last_name}`}
                  </TableCell>
                  <TableCell>{item?.document}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>{item?.faculty}</TableCell>
                  <TableCell align="center">
                    <ThemeProvider theme={theme}>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => {
                          setFormOption("put");
                          setSelectedDean(item);
                          handleClickOpen();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </ThemeProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ThemeProvider theme={theme}>
          <Grid container rowSpacing={3} columnSpacing={1} marginTop={3}>
            <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={actualPage}
                color="pagination"
                onChange={handleChangePage}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Grid container rowSpacing={3} columnSpacing={1} marginTop={5}>
            <Grid xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setFormOption("post");
                  handleClickOpen();
                }}
              >
                Agregar decano
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>

      <Dialog
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const formJson = Object.fromEntries(formData.entries());

            handleDean({
              document: formJson.document,
              first_name: formJson.name,
              last_name: formJson.last_name,
              email: formJson.email,
              faculty: formJson.faculty,
              campus_id: user?.id,
            });
          },
        }}
      >
        <DialogTitle>
          {formOption === "post"
            ? "Registro de nuevo decano"
            : "Actualización de decano"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Ingrese los datos del decano</DialogContentText>
          <ThemeProvider theme={theme}>
            <TextField
              required
              margin="dense"
              id="document"
              name="document"
              label="Documento"
              type="number"
              defaultValue={selectedDean?.document}
              fullWidth
              variant="standard"
            />
            <br />

            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Nombre"
              type="text"
              defaultValue={selectedDean?.first_name}
              fullWidth
              variant="standard"
            />
            <br />

            <TextField
              required
              margin="dense"
              id="last_name"
              name="last_name"
              label="Apellido"
              type="text"
              defaultValue={selectedDean?.last_name}
              fullWidth
              variant="standard"
            />
            <br />

            <TextField
              required
              margin="dense"
              id="email"
              name="email"
              label="Correo electrónico"
              type="email"
              defaultValue={selectedDean?.email}
              fullWidth
              variant="standard"
            />
            <br />

            <Autocomplete
              sx={{ mt: 2 }}
              disablePortal
              id="combo-box-demo"
              options={campos?.Facultades || []}
              defaultValue={selectedDean?.faculty}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Facultad"
                  id="faculty"
                  name="faculty"
                  size="small"
                  fullWidth
                  variant="standard"
                />
              )}
            />

            <br />
          </ThemeProvider>
        </DialogContent>
        <DialogActions>
          <ThemeProvider theme={theme}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Guardar"
              )}
            </Button>
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
