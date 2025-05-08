import React from "react";
import { theme } from "../resources/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { UseContext } from "../context/UseContext.js";
import "../styles/options.css";

function Options({ list }) {
  const { option, setOption } = React.useContext(UseContext);
  return (
    <>
      <Grid container className="option-box">
        <ThemeProvider theme={theme}>
          {list?.map((item) => {
            return (
              <Grid xs={list.length === 3 ? 4 : 3} key={item.id}>
                <div
                  className={option !== item.id ? "option" : "option-selected"}
                  onClick={() => {
                    setOption(item.id);
                  }}
                >
                  <item.icon className="logo-progress" color="primary" />
                </div>
                <p className="option-title">{item.name}</p>
              </Grid>
            );
          })}
        </ThemeProvider>
      </Grid>
    </>
  );
}

export default Options;
