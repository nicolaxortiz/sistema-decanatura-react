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
            por lo tanto debe tener en cuenta que:
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
            - Los datos personales serán usados únicamente con fines académicos.
          </div>
        </Grid>
        <Grid xs={12}>
          <div>
            - Se recomienda llenar la información siguiendo los pasos que el
            sistema le ofrece.
          </div>
        </Grid>
        <Grid xs={12}>
          <div>
            - Para un correcto uso del sistema, se recomienda leer el manual de
            usuario correspondiente.
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
