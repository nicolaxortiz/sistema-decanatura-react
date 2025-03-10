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
import IconButton from "@mui/material/IconButton";
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
  const [actualPage, setActualPage] = React.useState(1);
  const [totalFormat, setTotalFormat] = React.useState();
  const { setUser, user, configuration } = React.useContext(UseContext);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handlePDF = async (id) => {
    try {
      const response = await APIDocument.getDocument(
        configuration?.semester,
        id
      );

      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      setMessage("Error al generar el PDF, inténtelo nuevamente");
      setCode("error");
      handleClick();
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
    } catch (error) {}
  };

  const handleSignDocument = async (id, is_signed) => {
    try {
      const response = await APIFormat.putSchedule(id, {
        is_signed: !is_signed,
      });

      if (response.status === 200) {
        fetchData();
        setMessage("El estado del formato fue actualizado");
        setCode("success");
        handleClick();
      }
    } catch (error) {
      setMessage("Error al actualizar, inténtelo nuevamente");
      setCode("error");
      handleClick();
    }
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
        actualPage
      );

      if (response.status === 200) {
        setLoading(false);
        setFormatData(response.data.format);
        setTotalPages(Math.ceil(response.data.count / 8));
        setTotalFormat(response.data.count);
      }
    } catch (error) {
      if (error.response?.status === 404) {
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
  }, [user]);

  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-finish">Listado de actividades</div>
        </Grid>

        <Grid xs={12} sx={{ marginLeft: 2 }}>
          <p>
            Mostrando {formatData?.length} actividades de {totalFormat}.
          </p>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Docente</TableCell>
                <TableCell>Vinculación</TableCell>
                <TableCell>Campus</TableCell>
                <TableCell align="center">Semestre</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Formato</TableCell>
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
                    {row.is_signed ? "Firmado" : "No firmado"}
                  </TableCell>
                  <TableCell align="center">
                    <ThemeProvider theme={theme}>
                      {!row.is_signed && (
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

                      <IconButton
                        aria-label="pdf"
                        size="small"
                        onClick={() => {
                          handlePDF(row.teacher_id);
                        }}
                      >
                        <PictureAsPdfIcon />
                      </IconButton>

                      {row.is_signed ? (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            handleSignDocument(row.id, row.is_signed);
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={() => {
                            handleSignDocument(row.id, row.is_signed);
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
                disabled={loading}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>

      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000}
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
