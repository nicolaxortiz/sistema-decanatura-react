import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";
import "../styles/productForm.css";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { UseContext } from "../context/UseContext.js";
import { theme } from "../resources/theme.js";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import { ProductValidation } from "../validations/ProductValidation.js";
import { useForm } from "../hooks/UseForms.js";
import { useNavigate } from "react-router-dom";
import * as APIactividades from "../API/ActivityCall.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ProductButton({ state, products }) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { activities, user, setTab, tab } = React.useContext(UseContext);

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

  const handleSubmitButton = async () => {
    if (user && activities) {
      navigate("/schedule");
    }
  };
  return (
    <>
      <Grid container rowSpacing={3} columnSpacing={1}>
        <Grid xs={6} sm={6} md={6} lg={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setTab(tab - 1);
              navigate("/activity");
            }}
          >
            Regresar
          </Button>
        </Grid>

        <Grid xs={6} sm={6} md={6} lg={6}>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={!state}
            onClick={() => handleSubmitButton()}
          >
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Continuar"
            )}
          </Button>
        </Grid>
      </Grid>
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

export default ProductButton;
