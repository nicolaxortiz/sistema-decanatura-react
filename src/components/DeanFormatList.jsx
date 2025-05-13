import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Pagination from "@mui/material/Pagination";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import * as APIFormat from "../API/FormatCall.js";
import * as APIDocument from "../API/DocumentCall.js";
import * as APITeacher from "../API/TeacherCall.js";
import * as APIprogram from "../API/ProgramCall.js";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Button } from "@mui/material";

function DeanFormatList() {
  const navigate = useNavigate();
  const [formatData, setFormatData] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [totalPages, setTotalPages] = React.useState(0);
  const [actualPage, setActualPage] = React.useState(1);
  const [totalFormat, setTotalFormat] = React.useState();
  const [searchName, setSearchName] = React.useState("");
  const [programData, setProgramData] = React.useState([]);
  const [program, setProgram] = React.useState(null);
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

  const handleSignDocument = async (id, is_dean_signed) => {
    try {
      const response = await APIFormat.putSchedule(id, {
        is_dean_signed: !is_dean_signed,
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
    try {
      const response = await APIFormat.getSignedByProgramIdAndSemester(
        program?.id,
        configuration?.semester,
        null,
        null,
        true,
        false
      );

      if (response.status === 200) {
        response.data.format.forEach(async (element) => {
          handleSignDocument(element.id, false);
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron formatos para firmar");
        setCode("warning");
        handleClick();
      } else {
        handleClose();
        setMessage("Error al traer los datos, inténtelo nuevamente");
        setCode("error");
        handleClick();
      }
    }
  };

  const handleChangePage = (event, value) => {
    setActualPage(value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await APIFormat.getSignedByProgramIdAndSemester(
        program?.id,
        configuration?.semester,
        searchName,
        actualPage,
        true,
        null
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

  const fetchProgramsData = async () => {
    try {
      const response = await APIprogram.getByFacultyAndCampusId(
        user?.campus_id,
        user?.faculty
      );
      if (response.status === 200) {
        setProgramData(response.data.programs);
      }
    } catch (error) {
      setProgramData([]);
      if (error.response.status === 401) {
        setSesionInvalid(true);
      } else if (error.response?.status === 404) {
        handleClose();
        setMessage("No se encontraron programas");
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
    if (user) {
      setTotalFormat(0);
      fetchData();
    }
  }, [user, searchName, program, actualPage]);

  React.useEffect(() => {
    if (user) {
      fetchProgramsData();
    }
  }, []);

  React.useEffect(() => {
    setActualPage(1);
  }, [program]);

  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">Listado de formatos</div>
        </Grid>

        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid xs={7}>
            <FormControl sx={{ m: 1, width: "70%" }} size="small">
              <TextField
                label="Nombre del docente"
                disabled={!program}
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

          <Grid xs={3}>
            <FormControl sx={{ m: 1, width: "100%" }} size="small">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                disabled={!programData}
                options={programData}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={program}
                onChange={(event, newValue) => setProgram(newValue)}
                size="small"
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Programa" />
                )}
              />
            </FormControl>
          </Grid>

          <ThemeProvider theme={theme}>
            <Grid xs={2}>
              <FormControl sx={{ m: 1, width: "100%" }} size="small">
                <Button
                  variant="contained"
                  color="search"
                  disabled={!program || formatData === undefined}
                  fullWidth
                  onClick={() => {
                    handleSetAllSigned();
                  }}
                >
                  Firmar todos
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

                      {row.is_dean_signed && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            handleSignDocument(row.id, row.is_dean_signed);
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}

                      {!row.is_dean_signed && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            handleSignDocument(row.id, row.is_dean_signed);
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
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

export default DeanFormatList;
