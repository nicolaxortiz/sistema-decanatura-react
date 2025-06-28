import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import "../styles/productForm.css";
import { UseContext } from "../context/UseContext.js";
import { Button } from "@mui/material";

function ProductButton({ state }) {
  const { activities, user, setTab } = React.useContext(UseContext);

  const handleSubmitButton = async () => {
    if (user && activities) {
      setTab(4);
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
              setTab(2);
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
            Continuar
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductButton;
