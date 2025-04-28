import React from "react";
import { UseContext } from "../context/UseContext.js";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { theme } from "../resources/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function FinishSesionModal() {
  const navigate = useNavigate();
  const {
    setSesionInvalid,
    sesionInvalid,
    setUser,
    setActivities,
    setDataSchedule,
    setConfiguration,
    setOption,
    setTab,
  } = React.useContext(UseContext);

  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleLogout();
  };

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Activity");
    localStorage.removeItem("Schedule");
    localStorage.removeItem("Configuration");
    localStorage.removeItem("Token");
    setUser();
    setActivities();
    setDataSchedule();
    setConfiguration();
    setRole(null);
    setOption(1);
    setTab(1);
    setSesionInvalid(false);
    navigate("/login");
  };

  React.useEffect(() => {
    if (sesionInvalid) {
      handleClickOpen();
    }
  }, [sesionInvalid]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Sesión caducada</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          La sesión ha caducado, por favor inicie sesión nuevamente.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ThemeProvider theme={theme}>
          <Button onClick={handleClose} autoFocus>
            Aceptar
          </Button>
        </ThemeProvider>
      </DialogActions>
    </Dialog>
  );
}

export default FinishSesionModal;
