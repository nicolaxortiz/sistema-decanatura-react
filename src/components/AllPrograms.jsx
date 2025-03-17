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
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { theme } from "../resources/theme.js";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as APIprogram from "../API/ProgramCall";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { UseContext } from "../context/UseContext.js";

export default function AllPrograms() {
  const { user, configuration } = React.useContext(UseContext);
  const [programData, setProgramData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [selectedProgram, setSelectedProgram] = React.useState();
  const [formOption, setFormOption] = React.useState();
  const [totalPages, setTotalPages] = React.useState(0);
  const [actualPage, setActualPage] = React.useState(1);
  const [totalPrograms, setTotalPrograms] = React.useState(0);

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
    setSelectedProgram();
  };

  const handleProgram = async (form) => {
    setLoading(true);

    if (formOption === "post") {
      try {
        const response = await APIprogram.postProgram(form);

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Programa creado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        setLoading(false);
        setMessage("Error al guardar, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    } else {
      try {
        const response = await APIprogram.updateProgram(
          selectedProgram?.program_id,
          form
        );

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Programa actualizado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        setLoading(false);
        setMessage("Error al actualizar, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleChangePage = (event, value) => {
    setActualPage(value);
  };

  const fetchData = async () => {
    try {
      const response = await APIprogram.getByCampusId(
        configuration?.campus_id,
        actualPage
      );
      if (response.status === 200) {
        setProgramData(response.data.programs);
        setTotalPages(Math.ceil(response.data.count / 8));
        setTotalPrograms(response.data.count);
      }
    } catch (error) {
      setProgramData();
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [user, loading, actualPage]);
  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">Listado de Programas</div>
        </Grid>

        <Grid xs={12} sx={{ marginLeft: 2 }}>
          <p>
            Mostrando {programData?.length} programas de {totalPrograms}
          </p>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre del programa</TableCell>
                <TableCell>Nombre del coordinador</TableCell>
                <TableCell>Campus</TableCell>
                <TableCell align="center">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programData?.map((item) => (
                <TableRow
                  key={item.program_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{item.program_name}</TableCell>
                  <TableCell component="th" scope="row">
                    {item.coordinator_first_name != null
                      ? `${item.coordinator_first_name} ${item.coordinator_last_name}`
                      : "Sin asignar"}
                  </TableCell>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell align="center">
                    <ThemeProvider theme={theme}>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => {
                          setFormOption("put");
                          setSelectedProgram(item);
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
                Agregar programa
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
            handleProgram({
              name: formJson.name,
              campus_id: configuration?.campus_id,
            });
          },
        }}
      >
        <DialogTitle>
          {formOption === "post"
            ? "Registro de programa nuevo"
            : "Actualización de programa"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingrese el nombre del programa (Recuerde que debe registrar un
            coordinador posteriormente)
          </DialogContentText>
          <ThemeProvider theme={theme}>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Nombre del programa"
              type="text"
              defaultValue={selectedProgram?.program_name}
              fullWidth
              variant="standard"
            />
            <br />
            <br />

            {formOption === "put" && (
              <TextField
                required
                margin="dense"
                id="name"
                name="name"
                label="Coordinador asignado"
                type="text"
                value={
                  selectedProgram?.coordinator_first_name != null
                    ? `${selectedProgram?.coordinator_first_name} ${selectedProgram?.coordinator_last_name}`
                    : "Sin asignar"
                }
                fullWidth
                variant="standard"
                disabled
              />
            )}
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
    </>
  );
}
