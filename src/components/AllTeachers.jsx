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
import TextField from "@mui/material/TextField";
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
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as APIDocentes from "../API/TeacherCall";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function AllTeachers() {
  const [teacherData, setTeacherData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [filterState, setFilterState] = React.useState(true);

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
    if (form.documento > 0) {
      setLoading(true);
      try {
        const response = await APIDocentes.createOne(form);

        if (response.status === 200) {
          setLoading(false);
          handleClose();
          setMessage("Docente creado correctamente");
          setCode("success");
          handleClick();
        }
      } catch (error) {
        setMessage("Error al guardar, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleInactive = async (id, newState) => {
    setLoading(true);
    try {
      const response = await APIDocentes.updateState(id, newState);

      if (response.status === 200) {
        setLoading(false);
        setMessage("El estado del docente fue actualizado");
        setCode("success");
        handleClick();
      }
    } catch (error) {
      setMessage("Error al actualizar, inténtelo nuevamente");
      setCode("error");
      handleClick();
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await APIDocentes.getAll(filterState);

        if (response?.status === 200) {
          setTeacherData(response.data.teachers);
        }
      } catch (error) {
        setTeacherData();
        if (error.response?.status === 404) {
          handleClose();
          setMessage("No se encontraron campos para dicho filtro");
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

    fetchData();
  }, [loading, filterState]);

  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-form">
            Listado de docentes {filterState ? "activos" : "inactivos"}
          </div>
        </Grid>

        <Grid xs={12} sx={{ display: "flex", justifyContent: "end" }}>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Filtro</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterState}
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
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teacherData?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.nombres}</TableCell>
                  <TableCell>{row.apellidos}</TableCell>
                  <TableCell>{row.facultad}</TableCell>
                  <TableCell>{row.campus}</TableCell>
                  <TableCell>{row.unidadAcademica}</TableCell>
                  <TableCell>{row.vinculacion}</TableCell>
                  <TableCell>
                    {filterState ? (
                      <PersonOffIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleInactive(row._id, false);
                        }}
                      />
                    ) : (
                      <PersonAddIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleInactive(row._id, true);
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
          <Grid container rowSpacing={3} columnSpacing={1} marginTop={5}>
            <Grid xs={12}>
              <Button variant="contained" fullWidth onClick={handleClickOpen}>
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
              documento: parseInt(formJson.documento),
              correo: formJson.correo,
              celular: parseInt(formJson.celular),
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
              id="documento"
              name="documento"
              label="Documento"
              type="number"
              fullWidth
              variant="standard"
            />
            <br />
            <TextField
              required
              margin="dense"
              id="correo"
              name="correo"
              label="Correo electronico"
              type="email"
              fullWidth
              variant="standard"
            />
            <br />
            <TextField
              required
              margin="dense"
              id="celular"
              name="celular"
              label="Celular"
              type="number"
              fullWidth
              variant="standard"
            />
          </ThemeProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnack}
        onClose={handleCloseSnack}
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

export default AllTeachers;
