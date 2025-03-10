import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import "../styles/information.css";

export const Information = () => {
  return (
    <div className="infor-box">
      <Grid container rowSpacing={2}>
        <Grid xs={12}>
          <div className="title-info">F-DC-54</div>
        </Grid>
        <Grid xs={12}>
          <div style={{ fontWeight: 500 }}>
            Este es un sistema encargado de la gestión del documento F-DC-54,
            por lo tanto recuerde que:
          </div>
        </Grid>
        <Grid xs={12}>
          <div>
            - Para el ingreso debe haber sido registrado en la base de datos de
            docentes.
          </div>
        </Grid>
        <Grid xs={12}>
          <div>
            - Sus datos personales serán usados unicamente con fines académicos.
          </div>
        </Grid>
        <Grid xs={12}>
          <div>
            - Debe seguir las instrucciones que el sistema le indique para el
            correcto llenado de la información.
          </div>
        </Grid>
        <Grid xs={12}>
          <div>
            - Si es su primera vez usando el sistema puede revisar el manual del
            docente.
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
