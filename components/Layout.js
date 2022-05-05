//react
import Head from "next/head";
import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
//material ui
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Box,
  Badge,
  Button,
  MenuItem,
  Menu,
} from "@material-ui/core";
//cookies
import Cookies from "js-cookie";
//components
import useStyles from "../utils/styles";
import { Store } from "../utils/Store";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import data from "../utils/data";
//styling
import styled from "styled-components";
import { Colors } from "../utils/Theme";
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
  const classes = useStyles();
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
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
      type: darkMode ? "dark" : "light",
      primary: {
        main: "rgb(4, 148, 220)",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const loginHandler = () => {
    router.push("/login");
  };

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - Next10 Marketplace` : "Next10 Marketplace"}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>
                    Next10 Marketplace
                  </Typography>
                </Link>
              </NextLink>
            </Box>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              {data.admin.includes(currentAccount) ? (
                <Button
                  onClick={loginHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Admin
                </Button>
              ) : (
                ""
              )}
              {/* {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  onClick={loginHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Admin
                </Button>
              )} */}
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
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next10 Marketplace.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
