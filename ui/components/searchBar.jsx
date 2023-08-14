"use client";

import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SearchOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SearchBar(props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(props.query);

  return (
    <Box
      sx={props.sx}
      component="form"
      noValidate
      autoComplete="on"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${searchTerm}`);
      }}
    >
      <Grid container>
        <Grid xs={11}>
          <TextField
            id="outlined-basic"
            size="small"
            label="Search"
            variant="outlined"
            sx={{ width: "100%" }}
            value={searchTerm}
            onChange={(e) => {
              e.preventDefault();
              setSearchTerm(e.target.value);
            }}
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
