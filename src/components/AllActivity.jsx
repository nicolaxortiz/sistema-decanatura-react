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
  FormControl,
  IconButton,
  ThemeProvider,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Tooltip,
} from "@mui/material";
import { theme } from "../resources/theme.js";
import * as APIFormat from "../API/FormatCall.js";
import * as APIDocument from "../API/DocumentCall.js";
import * as APITeacher from "../API/TeacherCall.js";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";

function AllActivity() {
  const navigate = useNavigate();
  const [formatData, setFormatData] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = React.useState(0);
  const [filterState, setFilterState] = React.useState(true);
  const [actualPage, setActualPage] = React.useState(1);
  const [totalFormat, setTotalFormat] = React.useState();
  const [searchName, setSearchName] = React.useState("");
  const { setUser, user, configuration, setSesionInvalid } =
    React.useContext(UseContext);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handlePDF = async (row) => {
    try {
      const response = await APIDocument.getDocument(
        configuration?.semester,
        row.teacher_id
      );

      if (response.status === 200) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const pdfFileName = `F-DC-54 - ${row?.first_name} ${row?.last_name} - Semestre ${configuration?.semester}.pdf`;

        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFileName;
        a.click();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else {
        setMessage("Aún no ha registrado una firma en la configuración");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleEdit = async (program_id, document) => {
    try {
      const response = await APITeacher.getByDocument(program_id, document);

      if (response.status === 200) {
        const actualTeacher = response.data.teacher;
        const StringTeacher = JSON.stringify(actualTeacher);
        const userEdit = JSON.parse(localStorage.getItem("User"));
        localStorage.setItem("UserEdit", JSON.stringify(userEdit));
        localStorage.setItem("User", StringTeacher);
        setUser(actualTeacher);
        navigate("/home");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      }
    }
  };

  const handleSignDocument = async (id, is_coord_signed) => {
    try {
      const response = await APIFormat.putSchedule(id, {
        is_coord_signed: !is_coord_signed,
      });

      if (response.status === 200) {
        fetchData();
        setMessage("El estado del formato fue actualizado");
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

  const handleSetAllSigned = async () => {
    formatData.forEach(async (element) => {
      handleSignDocument(element.id, false);
    });
  };

  const handleChangePage = (event, value) => {
    setActualPage(value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await APIFormat.getByProgramIdAndSemester(
        user?.program_id,
        configuration?.semester,
        searchName,
        actualPage,
        filterState
      );

      if (response.status === 200) {
        setLoading(false);
        setFormatData(response.data.format);
        setTotalPages(Math.ceil(response.data.count / 8));
        setTotalFormat(response.data.count);
      }
    } catch (error) {
      setFormatData();
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron actividades del semestre");
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
  }, [user, searchName, filterState, actualPage]);

  React.useEffect(() => {
    setActualPage(1);
  }, [filterState]);

  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">
            Listado de formatos {filterState ? "finalizados" : "en progreso"}
          </div>
        </Grid>

        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid xs={8}>
            <FormControl sx={{ m: 1, width: "70%" }} size="small">
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
                <MenuItem value={true}>Finalizados</MenuItem>
                <MenuItem value={false}>En progreso</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <ThemeProvider theme={theme}>
            <Grid xs={2}>
              <FormControl sx={{ m: 1, width: "100%" }} size="small">
                <Button
                  disabled={filterState === false || formatData === undefined}
                  variant="contained"
                  color="search"
                  fullWidth
                  onClick={() => {
                    handleSetAllSigned();
                  }}
                >
                  Firmar pagina
                </Button>
              </FormControl>
            </Grid>
          </ThemeProvider>

          <Grid xs={12} sx={{ marginLeft: 2 }}>
            <p>Número total de formatos: {totalFormat}</p>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Docente</TableCell>
                <TableCell>Vinculación</TableCell>
                <TableCell>Campus</TableCell>
                <TableCell align="center">Semestre</TableCell>
                <TableCell align="center">Firma coordinador</TableCell>
                <TableCell align="center">Firma decano</TableCell>
                <TableCell align="center">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formatData?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.first_name} {row.last_name}
                  </TableCell>
                  <TableCell>{row.employment_type}</TableCell>
                  <TableCell>{row.campus}</TableCell>
                  <TableCell align="center">{row.semester}</TableCell>
                  <TableCell align="center">
                    {row.is_coord_signed ? "Firmado" : "No firmado"}
                  </TableCell>
                  <TableCell align="center">
                    {row.is_dean_signed ? "Firmado" : "No firmado"}
                  </TableCell>
                  <TableCell align="center">
                    <ThemeProvider theme={theme}>
                      <Tooltip title="Editar formato" arrow>
                        {!row.is_coord_signed && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => {
                              handleEdit(user?.program_id, row.document);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </Tooltip>

                      <Tooltip title="Ver formato" arrow>
                        {row.is_finish && (
                          <IconButton
                            aria-label="pdf"
                            size="small"
                            onClick={() => {
                              handlePDF(row);
                            }}
                          >
                            <PictureAsPdfIcon />
                          </IconButton>
                        )}
                      </Tooltip>

                      {!row.is_dean_signed &&
                        row.is_coord_signed &&
                        row.is_finish && (
                          <Tooltip title="Quitar firma" arrow>
                            <IconButton
                              aria-label="edit"
                              size="small"
                              onClick={() => {
                                handleSignDocument(row.id, row.is_coord_signed);
                              }}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                      {!row.is_coord_signed && row.is_finish && (
                        <Tooltip title="Firmar formato" arrow>
                          <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => {
                              handleSignDocument(row.id, row.is_coord_signed);
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
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
                color="pagination"
                onChange={handleChangePage}
                disabled={loading || !!searchName}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
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

export default AllActivity;
