import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { theme } from "../resources/theme.js";
import CircularProgress from "@mui/material/CircularProgress";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as APIDocentes from "../API/TeacherCall";
import { UseContext } from "../context/UseContext.js";

function AllTeachers() {
  const { user, configuration, setSesionInvalid } =
    React.useContext(UseContext);
  const [teacherData, setTeacherData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [filterState, setFilterState] = React.useState(true);
  const [searchName, setSearchName] = React.useState("");
  const [totalPages, setTotalPages] = React.useState(0);
  const [actualPage, setActualPage] = React.useState(1);
  const [totalTeachers, setTotalTeachers] = React.useState();

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
  };

  const handleNewUser = async (form) => {
    setLoading(true);
    try {
      const response = await APIDocentes.postTeacher(form);

      if (response.status === 200) {
        setLoading(false);
        handleClose();
        setMessage("Docente creado correctamente");
        setCode("success");
        handleClick();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
        setLoading(false);
        setMessage("Error al guardar, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleChangeStatus = async (id, is_active) => {
    setLoading(true);
    try {
      const response = await APIDocentes.updateTeacher(id, {
        is_active: !is_active,
      });

      if (response.status === 200) {
        fetchData();
        setLoading(false);
        setMessage("El estado del docente fue actualizado");
        setCode("success");
        handleClick();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
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
      const response = await APIDocentes.getAll(
        user?.program_id,
        filterState,
        searchName,
        actualPage
      );

      if (response?.status === 200) {
        setTeacherData(response.data.teachers);
        setTotalPages(Math.ceil(response.data.count / 8));
        setTotalTeachers(response.data.count);
      }
    } catch (error) {
      setTeacherData();
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron docentes que cumplan con el filtro");
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
  }, [loading, filterState, searchName, actualPage]);

  React.useEffect(() => {
    setActualPage(1);
  }, [filterState]);

  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">
            Listado de docentes {filterState ? "activos" : "inactivos"}
          </div>
        </Grid>

        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid xs={10}>
            <FormControl sx={{ m: 1, width: "50%" }} size="small">
              <TextField
                label="Nombre del docente"
                size="small"
                fullWidth
                name="name"
                value={searchName}
                onChange={(event) => {
                  setSearchName(event.target.value);
                }}
              />
            </FormControl>
          </Grid>

          <Grid xs={2}>
            <FormControl sx={{ m: 1, width: "90%" }} size="small">
              <InputLabel id="demo-simple-select-label">Filtro</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterState}
                fullWidth
                label="Filtro"
                onChange={(e) => {
                  setFilterState(e.target.value);
                }}
              >
                <MenuItem value={true}>Activos</MenuItem>
                <MenuItem value={false}>Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} sx={{ marginLeft: 2 }}>
            <p>
              Mostrando {teacherData?.length || 0} docentes de{" "}
              {totalTeachers || 0}.
            </p>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Facultad</TableCell>
                <TableCell>Campus</TableCell>
                <TableCell>Unidad académica</TableCell>
                <TableCell>Vinculación</TableCell>
                <TableCell align="center">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teacherData?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.faculty}</TableCell>
                  <TableCell>{row.campus}</TableCell>
                  <TableCell>{row.program_name}</TableCell>
                  <TableCell>{row.employment_type}</TableCell>
                  <TableCell align="center">
                    {filterState ? (
                      <PersonOffIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleChangeStatus(row.id, row.is_active);
                        }}
                      />
                    ) : (
                      <PersonAddIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleChangeStatus(row.id, row.is_active);
                        }}
                      />
                    )}
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
                disabled={loading || !!searchName}
              />
            </Grid>
          </Grid>

          <Grid container rowSpacing={3} columnSpacing={1} marginTop={5}>
            <Grid xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleClickOpen}
                disabled={!configuration}
              >
                Agregar docente
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
            handleNewUser({
              document: parseInt(formJson.document),
              first_name: formJson.first_name,
              last_name: formJson.last_name,
              email: formJson.email,
              campus: configuration?.campus_name,
              program_name: configuration?.program_name,
              program_id: user?.program_id,
            });
          },
        }}
      >
        <DialogTitle>Nuevo docente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingrese los datos del nuevo docente. El mismo se encargara de llenar
            el resto de la información.
          </DialogContentText>
          <ThemeProvider theme={theme}>
            <TextField
              required
              margin="dense"
              id="document"
              name="document"
              label="Documento"
              type="number"
              fullWidth
              variant="standard"
            />
            <br />
            <TextField
              required
              margin="dense"
              id="first_name"
              name="first_name"
              label="Nombres"
              type="text"
              fullWidth
              variant="standard"
            />
            <br />
            <TextField
              required
              margin="dense"
              id="last_name"
              name="last_name"
              label="Apellidos"
              type="text"
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
              fullWidth
              variant="standard"
            />
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

export default AllTeachers;
