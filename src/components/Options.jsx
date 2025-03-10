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
              <Grid xs={4} key={item.id}>
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

          {/* <Grid xs={4}>
            <div
              className={option !== 1 ? "option" : "option-selected"}
              onClick={() => {
                setOption(1);
              }}
            >
              <ArticleIcon className="logo-progress" color="primary" />
            </div>
            <p className="option-title">Documentos</p>
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
            <p className="option-title">Docentes</p>
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
            <p className="option-title">Formatos</p>
          </Grid> */}
        </ThemeProvider>
      </Grid>
    </>
  );
}

export default Options;
