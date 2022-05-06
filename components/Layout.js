//react/next/packages
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import axios from "axios";
//material ui
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  Switch,
  Badge,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import classes from "../utils/classes";

//styling
import styled from "styled-components";
import { Colors } from "../utils/Theme";
//components
import { Store } from "../utils/Store";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import data from "../utils/data";
import { getError } from "../utils/error";

const ConnectMetamask = styled.div`
  outline: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  border-radius: 40px;
  border: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 15px 20px;
  text-align: center;
  background-color: ${Colors.Primary};
  cursor: pointer;
`;

const ConnectedMetamask = styled.div`
  outline: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  border-radius: 40px;
  border: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 15px 20px;
  text-align: center;
  background: rgb(21, 17, 32, 0.4);
  cursor: default;
  border: 2px solid ${Colors.Primary};
`;

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { hasMetamask, currentAccount, connectWallet } =
    useContext(MarketplaceContext);
  const { darkMode, cart } = state;
  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: "hover",
        },
      },
    },

    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  //light/dark toggle
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };
  //togle sidebar
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  //filter by brands
  const [brands, setBrands] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(`/api/products/brands`);
      setBrands(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const adminHandler = () => {
    router.push("/admin/products");
  };

  return (
    <>
      <Head>
        <title>
          {title ? `${title} - Next10 Marketplace` : "Next10 Marketplace"}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                sx={classes.menuButton}
              >
                <MenuIcon sx={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography sx={classes.brand}>nex10</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {brands.map((brand) => (
                  <NextLink key={brand} href={`/search?brand=${brand}`}>
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={brand}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              {data.admin.includes(currentAccount) ? (
                <Button
                  onClick={adminHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Admin
                </Button>
              ) : (
                ""
              )}
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <div>
                {hasMetamask ? (
                  currentAccount ? (
                    <ConnectedMetamask>
                      {currentAccount.slice(0, 5)}...{currentAccount.slice(38)}
                    </ConnectedMetamask>
                  ) : (
                    <ConnectMetamask onClick={() => connectWallet()}>
                      Connect Wallet
                    </ConnectMetamask>
                  )
                ) : (
                  <ConnectMetamask>
                    <Link href="https://metamask.io/">Install Metamask</Link>
                  </ConnectMetamask>
                )}
              </div>
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      "Cart"
                    )}
                  </Typography>
                </Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Next10.</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
