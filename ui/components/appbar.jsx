"use client";

// Mui Imports
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SearchBar from "@/components/searchBar";
import { SearchOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname, useSearchParams } from "next/navigation";
import { AuthContext } from '@/app/auth.jsx';


import logo from "../assets/logo.svg"; // Suncorp logo

import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/appbar.module.css"; // Custom styling for

const pages = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Login", path: "/login" },
];

// good potential candidate for varies items based on admin privilege here.
const settings = [
  { label: "Profile", path: '/profile' },
  { label: "Logout", path: '/logout' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { auth } = React.useContext(AuthContext);

  function checkLogin(item) {
    if (auth){
      return item.label !== "Login"
    }
    else return item;
  }


  React.useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname, searchParams]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    // add suncorp green color here
    <AppBar position="static" style={{ background: "#009877" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" className={styles.desktop_image}>
            <Image src={logo} height={50} width={100} />
          </Link>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="green"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: "block",
              }}
            >
              {pages.filter(checkLogin).map((page) => (
                <Link href={page.path} key={page.label} passHref>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.filter(checkLogin).map((page) => (
              <Link href={page.path} key={page.label} passHref>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.label}
                </Button>
              </Link>
            ))}
          </Box>
          {/* centered mobile logo */}
          <Box sx={{ mx: "auto", display: "flex" }}>
            {isSearchOpen && pathname != "/search" ? (
              <Grid container>
                <Grid xs={10}>
                  <SearchBar />
                </Grid>
                <Grid xs={2}>
                  <IconButton onClick={toggleSearch} sx={{ marginLeft: "25%" }}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <Box className={styles.mobile_image}>
                <Link href="/">
                  <Image src={logo} height={50} width={100} />
                </Link>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex" }}>
            {!isSearchOpen && (
              <IconButton onClick={toggleSearch}>
                <SearchOutlined />
              </IconButton>
            )}
            {auth && <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src="/broken-image.jpg" />
              </IconButton>
            </Tooltip>}
            {auth && <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                  <Link href={setting.path} key={setting.label} passHref>
                    <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting.label}</Typography>
                    </MenuItem>
                  </Link>
              ))}
            </Menu>}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
