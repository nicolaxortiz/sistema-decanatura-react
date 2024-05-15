import React from "react";
import { theme } from "../resources/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArticleIcon from "@mui/icons-material/Article";
import { UseContext } from "../context/UseContext.js";
import "../styles/options.css";

function Options() {
  const { option, setOption } = React.useContext(UseContext);
  return (
    <>
      <Grid container className="option-box">
        <ThemeProvider theme={theme}>
          <Grid xs={4}>
            <div
              className={option !== 1 ? "option" : "option-selected"}
              onClick={() => {
                setOption(1);
              }}
            >
              <ArticleIcon className="logo-progress" color="primary" />
            </div>
          </Grid>
          <Grid xs={4}>
            <div
              className={option !== 2 ? "option" : "option-selected"}
              onClick={() => {
                setOption(2);
              }}
            >
              <PersonIcon className="logo-progress" color="primary" />
            </div>
          </Grid>
          <Grid xs={4}>
            <div
              className={option !== 3 ? "option" : "option-selected"}
              onClick={() => {
                setOption(3);
              }}
            >
              <LibraryBooksIcon className="logo-progress" color="primary" />
            </div>
          </Grid>
        </ThemeProvider>
      </Grid>
    </>
  );
}

export default Options;
