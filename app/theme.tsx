import { createTheme, responsiveFontSizes } from "@mui/material"
import { blue } from  "@mui/material/colors"

const theme = createTheme({
  palette: {
    primary: {
      main:  "#274c77",
    },
    secondary: {
      main: blue[100],
    },
    background: {
      default: "#e7ecef"
    }
  },
  typography: {
    fontFamily: "'Rubik', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
      fontSize: 70
    },
    h3: {
      fontWeight: 'bold',
      fontSize: 40
    },
  }
});

export default responsiveFontSizes(theme);