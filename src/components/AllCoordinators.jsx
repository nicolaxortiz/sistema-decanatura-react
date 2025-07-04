import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Pagination,
  Alert,
  TextField,
  IconButton,
  ThemeProvider,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { theme } from "../resources/theme.js";
import * as APIprogram from "../API/ProgramCall";
import * as APIcoordinator from "../API/CoordinatorCall.js";
import EditIcon from "@mui/icons-material/Edit";
import { UseContext } from "../context/UseContext.js";

export default function AllCoordinators() {
  const { user, setSesionInvalid } = React.useContext(UseContext);
  const [coordinatorData, setCoordinatorData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [selectedCoordinator, setSelectedCoordinator] = React.useState();
  const [formOption, setFormOption] = React.useState();
  const [totalPages, setTotalPages] = React.useState(0);
  const [actualPage, setActualPage] = React.useState(1);
  const [totalCoordinator, setTotalCoordinator] = React.useState(0);
  const [programList, setProgramList] = React.useState();
  const [selectedProgram, setSelectedProgram] = React.useState(null);

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
    setSelectedCoordinator();
    setSelectedProgram(null);
  };

  const handleCoordinator = async (form) => {
    setLoading(true);

    if (formOption === "post") {
      try {
        const response = await APIcoordinator.postCoordinator(form);

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Coordinador creado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        if (error.response.status === 401) {
          setSesionInvalid(true);
        } else if (error.response.status === 409) {
          setLoading(false);
          setMessage(
            "Ya existe un coordinador con ese documento, email o programa"
          );
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
        const response = await APIcoordinator.updateCoordinator(
          selectedCoordinator?.coordinator_id,
          form
        );

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Coordinador actualizado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        if (error.response.status === 401) {
          setSesionInvalid(true);
        } else if (error.response.status === 409) {
          setLoading(false);
          setMessage(
            "Ya existe un coordinador con ese documento, email o programa"
          );
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
      const response = await APIcoordinator.getByCampusId(user?.id, actualPage);
      if (response.status === 200) {
        setCoordinatorData(response.data.coordinators);
        setTotalPages(Math.ceil(response.data.count / 8));
        setTotalCoordinator(response.data.count);
      }
    } catch (error) {
      setCoordinatorData();
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron coordinadores");
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

  const fetchProgramsData = async () => {
    try {
      const response = await APIprogram.getAllByCampusId(user?.id);
      if (response.status === 200) {
        const options = response.data.programs.map((program) => ({
          label: program.program_name,
          id: program.program_id,
        }));

        setProgramList(options);
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
        setProgramList();
      }
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchProgramsData();
  }, [user, loading, actualPage]);
  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">Listado de Coordinadores</div>
        </Grid>

        <Grid xs={12} sx={{ marginLeft: 2 }}>
          <p>Número total de coordinadores: {totalCoordinator}</p>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre del coordinador</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell>Programa</TableCell>
                <TableCell align="center">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coordinatorData?.map((item) => (
                <TableRow
                  key={item.coordinator_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {`${item.first_name} ${item.last_name}`}
                  </TableCell>
                  <TableCell>{item?.document}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>{item?.program_name}</TableCell>
                  <TableCell align="center">
                    <ThemeProvider theme={theme}>
                      <Tooltip title="Editar coordinador" arrow>
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            setFormOption("put");
                            setSelectedCoordinator(item);
                            handleClickOpen();
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
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
                Agregar coordinador
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const formJson = Object.fromEntries(formData.entries());

            handleCoordinator({
              document: formJson.document,
              first_name: formJson.name,
              last_name: formJson.last_name,
              email: formJson.email,
              program_id: formJson.program,
            });
          },
        }}
      >
        <DialogTitle>
          {formOption === "post"
            ? "Registro de nuevo coordinador"
            : "Actualización de coordinador"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingrese los datos del coordinador (Recuerde asignar un programa)
          </DialogContentText>
          <ThemeProvider theme={theme}>
            <TextField
              required
              margin="dense"
              id="document"
              name="document"
              label="Documento"
              type="number"
              defaultValue={selectedCoordinator?.document}
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
              defaultValue={selectedCoordinator?.first_name}
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
              defaultValue={selectedCoordinator?.last_name}
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
              defaultValue={selectedCoordinator?.email}
              fullWidth
              variant="standard"
            />
            <br />

            <input
              name="program"
              type="hidden"
              value={
                selectedProgram?.id || selectedCoordinator?.program_id || ""
              }
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              disabled={!programList}
              options={programList}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={
                programList?.find(
                  (program) => program.id === selectedCoordinator?.program_id
                ) || selectedProgram
              }
              onChange={(event, newValue) => setSelectedProgram(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  margin="dense"
                  id="program_display"
                  name="program_display"
                  label="Programa"
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
