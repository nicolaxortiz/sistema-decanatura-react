import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import * as APIActividades from "../API/ActivityCall";
import * as APIDocument from "../API/DocumentCall.js";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function AllActivity() {
  const [activityData, setActivityData] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");

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
      const response = await APIDocument.getDocument(id);

      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      setMessage("Error al generar el PDF, intentelo nuevamente");
      setCode("error");
      handleClick();
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await APIActividades.getAll();

        if (response.status === 200) {
          setActivityData(response.data.activity);
        }
      } catch (error) {
        setMessage("Error al traer los datos, intentelo nuevamente");
        setCode("error");
        handleClick();
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="table-form">
        <Grid xs={12}>
          <div className="title-form">Listado de actividades</div>
        </Grid>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Docente</TableCell>
                <TableCell>Vinculación</TableCell>
                <TableCell>Campus</TableCell>
                <TableCell align="center">Semestre</TableCell>
                <TableCell align="center">Cantidad de actividades</TableCell>
                <TableCell align="center">Formato</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityData?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.idDocente.nombres} {row.idDocente.apellidos}
                  </TableCell>
                  <TableCell>{row.idDocente.vinculacion}</TableCell>
                  <TableCell>{row.idDocente.campus}</TableCell>
                  <TableCell align="center">
                    {process.env.REACT_APP_CURRENT_SEMESTER}
                  </TableCell>
                  <TableCell align="center">{row.actividad.length}</TableCell>
                  <TableCell align="center">
                    <ThemeProvider theme={theme}>
                      <IconButton
                        aria-label="pdf"
                        size="small"
                        onClick={() => {
                          handlePDF(row.idDocente._id);
                        }}
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                    </ThemeProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Snackbar open={open} onClose={handleClose} autoHideDuration={6000}>
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
