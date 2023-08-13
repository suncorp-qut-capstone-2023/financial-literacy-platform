"use client";

import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SearchOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box
      component="form"
      sx={{
        marginTop: "2rem",
        marginBottom: 0,
      }}
      noValidate
      autoComplete="on"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(searchTerm || "");
      }}
    >
      <Grid container>
        <Grid xs={11}>
          <TextField
            id="outlined-basic"
            size="small"
            label="Search"
            variant="outlined"
            sx={{ width: "100%", }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            {...props.inputProps}
            inputProps={{ "aria-label": "search" }}
          />
        </Grid>

        <Grid xs={1}>
          <IconButton type="submit">
            <SearchOutlined />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
