import React from "react";
import "../styles/footer.css";
import Grid from "@mui/material/Unstable_Grid2";

export const Footer = () => {
  return (
    <>
      <Grid container className="footer-box" rowSpacing={2}>
        <Grid xs={12} className="title-footer">
          Sistema de informe docente F-DC-54
        </Grid>
        <Grid xs={12} className="row-footer">
          Carlos Arturo Toloza Valencia - 2024
        </Grid>

        <Grid xs={12} className="row-footer">
          <div
            onClick={() => {
              window.open(
                "https://unidadestecno-my.sharepoint.com/:b:/g/personal/carturotoloza_uts_edu_co/EQx5AiYntqtKjtGdWVzp_OYBpPIp1vrdDm_fwiLyv7ypCw?e=snqIFl",
                "_blank"
              );
            }}
            style={{ cursor: "pointer" }}
          >
            Manual Docente
          </div>
        </Grid>

        <Grid xs={12} className="row-footer">
          <div
            onClick={() => {
              window.open(
                "https://unidadestecno-my.sharepoint.com/:b:/g/personal/carturotoloza_uts_edu_co/EcvgrZvgEx9IiSp3Wx21P-0BVdQhuVXe5hzbaEIB9OLkWQ?e=I4L1P3",
                "_blank"
              );
            }}
            style={{ cursor: "pointer" }}
          >
            Manual Administrador
          </div>
        </Grid>
      </Grid>
    </>
  );
};
