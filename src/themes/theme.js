import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#55EFC4",
    },
    contrastText: "#55EFC4",
  },
  overrides: {
    MuiPaper: {
      root: {
        padding: "16px",
        backgroundColor: "rgb(118, 118, 119, 0.16)",
        boxSizing: "border-box"
      }
    },
    MuiTab: {
      root: {
        color: "#DFE6E9"
      },
      textColorPrimary: {
        color: "#DFE6E9"
      }
    }
  }
});

export default theme;
