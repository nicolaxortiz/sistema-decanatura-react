import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#7b7b7b",
      main: "#434343",
      dark: "#000000",
      contrastText: "#fff",
    },

    white: {
      light: "#ffffff",
      main: "#fafafa",
      dark: "#f0f0f0",
      contrastText: "#fff",
    },

    pagination: {
      light: "#c2d8c4",
      main: "#93b3a8",
      dark: "#6a8f8f",
      contrastText: "#fff",
    },

    alert: {
      light: "#e3585a",
      main: "#d84142",
      dark: "#b93234",
      contrastText: "#fff",
    },

    pdf: {
      light: "#e1918b",
      main: "#be4646",
      dark: "#842d32",
      contrastText: "#fff",
    },

    search: {
      light: "#97c9f7",
      main: "#58a3f1",
      dark: "#4286df",
      contrastText: "#fff",
    },
  },
});
