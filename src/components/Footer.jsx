import React from "react";
import "../styles/footer.css";
import Grid from "@mui/material/Unstable_Grid2";
import { UseContext } from "../context/UseContext.js";

export const Footer = () => {
  const { user } = React.useContext(UseContext);

  return (
    <>
      <Grid container className="footer-box" rowSpacing={2}>
        <Grid xs={12} className="title-footer">
          Sistema de informe docente F-DC-54
        </Grid>
        <Grid xs={12} className="row-footer">
          Unidades Tecnológicas de Santander
        </Grid>
        <Grid xs={12} className="row-footer">
          Programa de Ingeniería de sistemas
        </Grid>
        <Grid xs={12} className="row-footer">
          2025
        </Grid>
      </Grid>
    </>
  );
};
