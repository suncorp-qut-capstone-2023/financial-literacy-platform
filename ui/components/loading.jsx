"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

const theme = createTheme({
  palette: {
    suncorpgreen: {
      main: "#009877",
      contrastText: "#000000",
    },
  },
});

export default function Loading() {
  return (
    <ThemeProvider theme={theme}>
      <div
        styles={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress
          color="suncorpgreen"
          sx={{marginTop:"20px"}}
        />
      </div>
    </ThemeProvider>
  );
}
