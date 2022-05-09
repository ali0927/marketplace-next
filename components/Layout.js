//react/next/packages
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Image from "next/image";
import { Dropdown } from "react-bootstrap";
//material ui
import { Avatar, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
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
// import MenuIcon from "@mui/icons-material/Menu";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import classes from "../utils/classes";
//components
import { Store } from "../utils/Store";
import data from "../utils/data";
import { getError } from "../utils/error";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import CheckContractApproval from "./Dialogs/CheckContractApproval";
//styling
import nex10Logo from "../public/images/logo/nex10-logo.png";
import { Colors } from "../utils/Theme";
import styled from "styled-components";
import ProceedWithPurchase from "./Dialogs/ProceedWithPurchase";
import PaymentForm from "./PaymentForm";
import Particulars from "./Dialogs/Particulars";

const CartItem = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  margin-bottom: 20px;
`;
const CartItemDetail = styled.div`
  display: flex;
  flex: 1;
  padding: 0 20px;
  flex-direction: column;
`;
const PurchaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  font-family: "Oxanium";
  color: #ffffff;
  width: 90%;
  background: ${Colors.Dialog};
  border-radius: 50px;
  margin: 0 auto 20px;
  text-decoration: none;
  box-shadow: 7px 6px 28px 1px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  outline: none;
  transition: 0.2s all;
  :active {
    transform: scale(0.98);
    box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.5);
  }
`;

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const { hasMetamask, currentAccount, connectWallet } =
    useContext(MarketplaceContext);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            background: "#30358C",
            padding: "24px",
          },
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
      primary: {
        main: "#0097DA",
      },
      secondary: {
        main: "#208080",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  //state
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [types, setTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState("");

  //togle sidebar
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  //filter by types
  const { enqueueSnackbar } = useSnackbar();
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(`/api/products/types`);
      setTypes(data);
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

  //remove product from cart
  const removeFromCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    dispatch({ type: "CART_REMOVE_ITEM", payload: { ...product, quantity } });
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
              {/* <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                sx={classes.menuButton}
              >
                <MenuIcon sx={classes.navbarButton} />
              </IconButton> */}
              <NextLink href="/" passHref>
                <Link>
                  <Image
                    src={nex10Logo}
                    alt="nex10Logo"
                    width={40}
                    height={48}
                  />
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
                    <Typography>Types</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {types.map((type) => (
                  <NextLink key={type} href={`/search?type=${type}`}>
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={type}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <Dropdown alignRight>
                <Dropdown.Toggle
                  variant="success"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transformation: "none",
                  }}
                >
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        <Avatar sx={classes.avatar}>
                          <ShoppingBagOutlinedIcon style={{ fontSize: 22 }} />
                        </Avatar>
                      </Badge>
                    ) : (
                      <Avatar sx={classes.avatar}>
                        <ShoppingBagOutlinedIcon style={{ fontSize: 22 }} />
                      </Avatar>
                    )}
                  </Typography>
                </Dropdown.Toggle>
                {cart.cartItems.length > 0 ? (
                  <Dropdown.Menu
                    style={{
                      paddingTop: "20px",
                      marginTop: "10px",
                      color: "#ffffff",
                      minWidth: 200,
                      background: "#152266",
                      zIndex: 10,
                      fontFamily: "Oxanium",
                    }}
                  >
                    {cart.cartItems.map((product) => (
                      <CartItem key={product._id}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          height={50}
                          width={50}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />

                        <CartItemDetail>
                          <span>
                            {product.brand} {product.name}
                          </span>
                          <span>
                            {product.price} {product.currency}
                          </span>
                        </CartItemDetail>
                        <CancelIcon
                          style={{ fontSize: 22, cursor: "pointer" }}
                          onClick={() => removeFromCartHandler(product)}
                        />
                      </CartItem>
                    ))}
                    <PurchaseButton onClick={() => setOpenDialog("first")}>
                      Purchase
                    </PurchaseButton>
                  </Dropdown.Menu>
                ) : (
                  <div style={{ background: "transparent" }}></div>
                )}
              </Dropdown>
              <CheckContractApproval
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              />
              <ProceedWithPurchase
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              />
              <Particulars>
                <PaymentForm />
              </Particulars>
              {data.admin.includes(currentAccount) ? (
                <Button onClick={adminHandler} fullWidth>
                  <Avatar sx={classes.avatar}>
                    <PersonOutlineOutlinedIcon style={{ fontSize: 22 }} />
                  </Avatar>
                </Button>
              ) : (
                ""
              )}
              <div>
                {hasMetamask ? (
                  currentAccount ? (
                    <Button sx={classes.connectedMetamaskButton}>
                      {currentAccount.slice(0, 5)}...{currentAccount.slice(38)}
                    </Button>
                  ) : (
                    <Button
                      sx={classes.metamaskButton}
                      onClick={() => connectWallet()}
                    >
                      Connect Wallet
                    </Button>
                  )
                ) : (
                  <Button sx={classes.metamaskButton}>
                    <Link href="https://metamask.io/">Install Metamask</Link>
                  </Button>
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <Container component="main" sx={classes.main}>
          {children}
        </Container>

        <Box component="footer" sx={classes.footer}>
          Copyright © 2022 NEX10 Labs Pte Ltd. All Rights Reserved.
        </Box>
      </ThemeProvider>
    </>
  );
}
