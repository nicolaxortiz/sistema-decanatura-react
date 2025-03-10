import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../resources/theme.js";
import Grid from "@mui/material/Unstable_Grid2";
import "../styles/progress.css";

import Badge from "@mui/material/Badge";
import { UseContext } from "../context/UseContext.js";

export const Progress = () => {
  const { tab, progItems } = React.useContext(UseContext);

  return (
    <>
      <Grid container className="progress-box">
        <ThemeProvider theme={theme}>
          {progItems.map((item) => {
            return (
              <Grid xs={3} key={item.id}>
                <div
                  className={
                    tab === item.id ? "circle-box-selected" : "circle-box"
                  }
                >
                  {item.status === "incomplete" ? (
                    <item.icon className="logo-progress" color="primary" />
                  ) : (
                    <Badge badgeContent={"✔"} color="primary">
                      <item.icon className="logo-progress" color="primary" />
                    </Badge>
                  )}
                </div>
                <p className="progress-title">{item.name}</p>
              </Grid>
            );
          })}
        </ThemeProvider>
      </Grid>
    </>
  );
};
