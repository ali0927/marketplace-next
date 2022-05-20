//react/next/packages

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  Drawer,
  DialogTitle,
  Link,
  List,
  ListItem,
  Menu,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Colors, Devices } from '../utils/Theme';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Head from 'next/head';
import Image from 'next/image';
import { MarketplaceContext } from '../utils/MarketplaceContext';
import MenuItem from '@mui/material/MenuItem';
import NextLink from 'next/link';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PurchaseDialog from './Dialogs/PurchaseDialog';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Store } from '../utils/Store';
import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';
import UcdCoin from '../public/images/uu/ucd-coin.png';
import axios from 'axios';
import classes from '../utils/classes';
import { createTheme } from '@mui/material/styles';
import data from '../utils/data';
import { getError } from '../utils/error';
import nex10Logo from '../public/images/logo/nex10-logo.png';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const ImageBox = styled.div`
  display: none;
  position: absolute;
  top: 10px;
  @media ${Devices.MobileM} {
    display: block;
  }
`;
const CartItem = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  background: #152266;
  padding: 10px;
  border-radius: 8px;
`;
const CartTitle = styled.div`
  font-family: Oxanium;
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
`;
const EmptyCart = styled.div`
  font-family: Oxanium;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  margin-top: 50px;
`;
const CartItemDetail = styled.div`
  display: flex;
  flex: 1;
  padding: 0 10px;
  flex-direction: column;
  width: 60%;
  align-self: flex-start;
`;
const ProductTitle = styled.div`
  color: #ffffff;
  display: flex;
  flex-direction: column;
`;
const ProductBrand = styled.div`
  font-family: Oxanium;
  font-size: 13px;
`;
const ProductType = styled.div`
  font-size: 13px;
  font-family: Oxanium;
  color: #f333cb;
`;
const ProductPricing = styled.div`
  margin-top: 10px;
`;
const ProductPrice = styled.span`
  font-size: 17px;
  color: #ffffff;
  font-family: 'Oxanium';
  font-weight: 700;
  margin-left: 5px;
`;
const ProductCurrency = styled.span`
  font-size: 12px;
  color: #ffffff;
  font-family: 'Oxanium';
  margin-left: 3px;
`;
const PurchaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  font-family: 'Oxanium';
  color: #ffffff;
  width: 90%;
  background: ${Colors.UUPrimary};
  border-radius: 50px;
  margin: 0 auto;
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
  //context
  const { hasMetamask, currentAccount, connectWallet } =
    useContext(MarketplaceContext);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            background: '#30358C',
            padding: '10px 30px',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            overflowX: 'hidden',
          },
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      primary: {
        main: '#0097DA',
      },
      secondary: {
        main: '#F333CB',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        // md: 900,
        md: 1060,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  //state
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [types, setTypes] = useState([]);
  const [showPurchase, setShowPurchase] = useState(''); //dialog authentication
  const [anchorEl, setAnchorEl] = useState(null); //cart menu
  const [navBackground, setNavBackground] = useState('appBarTransparent'); //on scroll change background color of header

  //ref
  const navRef = useRef();
  navRef.current = navBackground;

  //togle sidebar
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };
  //responsive cart menu
  const isDesktop = useMediaQuery('(min-width:900px)');
  //toggle cart menu
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //filter by types
  const { enqueueSnackbar } = useSnackbar();
  const fetchBrands = async () => {
    try {
      const { data } = await axios.get(`/api/products/types`);
      setTypes(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 20;
      if (show) {
        setNavBackground('appBarSolid');
      } else {
        setNavBackground('appBarTransparent');
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchBrands();
  }, []);

  const adminHandler = () => {
    router.push('/admin/products');
  };
  const inventoryHandler = () => {
    router.push('/inventory');
  };

  //remove product from cart
  const removeFromCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { ...product, quantity } });
  };

  //start purchase process
  const startPurchase = () => {
    setShowPurchase(true);
    setAnchorEl(null);
  };

  const startPurchaseMobile = () => {
    setShowPurchase(true);
    sidebarCloseHandler();
  };

  return (
    <>
      <Head>
        <title>
          {title ? `${title} - Next10 Marketplace` : 'Next10 Marketplace'}
        </title>
        <link rel="icon" href="/images/logo/nex10-logo.png" />
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed" elevation={0} sx={classes[navRef.current]}>
          <Toolbar sx={classes.toolbar}>
            <ImageBox>
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
            </ImageBox>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginInline: 'auto 0',
                maxWidth: '150px',
              }}
            >
              <Button
                onClick={inventoryHandler}
                fullWidth
                sx={isDesktop ? classes.visible : classes.hidden}
              >
                <Avatar sx={classes.avatar}>
                  <TakeoutDiningOutlinedIcon style={{ fontSize: 22 }} />
                </Avatar>
              </Button>
              {/* Desktop Cart */}
              <div>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={isDesktop ? classes.visible : classes.hidden}
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
                </Button>

                {cart.cartItems.length > 0 ? (
                  <Menu
                    sx={isDesktop ? classes.visible : classes.hidden}
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <CartTitle>Your Cart</CartTitle>
                    <MenuItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0',
                      }}
                    >
                      {cart.cartItems.map((product) => (
                        <CartItem key={product._id}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            height={60}
                            width={60}
                            style={{
                              borderRadius: '10px',
                              objectFit: 'cover',
                            }}
                          />

                          <CartItemDetail>
                            <ProductTitle>
                              <ProductBrand>{product.brand}</ProductBrand>
                              <ProductType>{product.type}</ProductType>
                            </ProductTitle>

                            <ProductPricing>
                              <Image
                                src={UcdCoin}
                                width="15"
                                height="15"
                                alt="ucdCoin"
                              />
                              <ProductPrice>{product.price}</ProductPrice>
                              <ProductCurrency>
                                {product.currency}
                              </ProductCurrency>
                            </ProductPricing>
                          </CartItemDetail>

                          <CancelIcon
                            style={{
                              fontSize: 22,
                              cursor: 'pointer',
                              color: 'white',
                            }}
                            onClick={() => removeFromCartHandler(product)}
                          />
                        </CartItem>
                      ))}
                    </MenuItem>
                    <PurchaseButton onClick={() => startPurchase()}>
                      Purchase
                    </PurchaseButton>
                  </Menu>
                ) : (
                  <></>
                )}
              </div>
              {/* Mobile Cart */}
              <div>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={sidebarOpenHandler}
                  sx={isDesktop ? classes.hidden : classes.visible}
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
                </Button>
                {cart.cartItems.length > 0 ? (
                  <Drawer
                    anchor="right"
                    open={sidebarVisible}
                    onClose={sidebarCloseHandler}
                    sx={isDesktop ? classes.hidden : classes.visible}
                  >
                    <List>
                      <ListItem sx={classes.listItemHeader}>
                        <CartTitle>Your Cart</CartTitle>
                        <CancelIcon
                          style={{
                            fontSize: 22,
                            cursor: 'pointer',
                            color: 'white',
                          }}
                          onClick={sidebarCloseHandler}
                        />
                      </ListItem>
                      <ListItem
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0',
                        }}
                      >
                        {cart.cartItems.map((product) => (
                          <CartItem key={product._id}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              height={60}
                              width={60}
                              style={{
                                borderRadius: '10px',
                                objectFit: 'cover',
                              }}
                            />

                            <CartItemDetail>
                              <ProductTitle>
                                <ProductBrand>{product.brand}</ProductBrand>
                                <ProductType>{product.type}</ProductType>
                              </ProductTitle>

                              <ProductPricing>
                                <Image
                                  src={UcdCoin}
                                  width="15"
                                  height="15"
                                  alt="ucdCoin"
                                />
                                <ProductPrice>{product.price}</ProductPrice>
                                <ProductCurrency>
                                  {product.currency}
                                </ProductCurrency>
                              </ProductPricing>
                            </CartItemDetail>

                            <CancelIcon
                              style={{
                                fontSize: 22,
                                cursor: 'pointer',
                                color: 'white',
                              }}
                              onClick={() => removeFromCartHandler(product)}
                            />
                          </CartItem>
                        ))}
                      </ListItem>
                      <PurchaseButton onClick={() => startPurchaseMobile()}>
                        Purchase
                      </PurchaseButton>
                    </List>
                  </Drawer>
                ) : (
                  <Drawer
                    anchor="right"
                    open={sidebarVisible}
                    onClose={sidebarCloseHandler}
                    sx={isDesktop ? classes.hidden : classes.visible}
                  >
                    <List>
                      <ListItem>
                        <EmptyCart>Your Cart Is Empty</EmptyCart>
                      </ListItem>
                    </List>
                  </Drawer>
                )}
              </div>

              {showPurchase && (
                <PurchaseDialog
                  showPurchase={showPurchase}
                  setShowPurchase={setShowPurchase}
                />
              )}
              {data.admin.includes(currentAccount) ? (
                <Button onClick={adminHandler} fullWidth>
                  <Avatar sx={classes.avatar}>
                    <PersonOutlineOutlinedIcon style={{ fontSize: 22 }} />
                  </Avatar>
                </Button>
              ) : (
                ''
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
                      Connect<span style={{ color: 'transparent' }}>_</span>
                      Wallet
                    </Button>
                  )
                ) : (
                  <Button
                    sx={classes.metamaskButton}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = 'https://metamask.io';
                    }}
                  >
                    Install<span style={{ color: 'transparent' }}>_</span>
                    Metamask
                  </Button>
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <Container component="main" sx={classes.main}>
          {children}
        </Container>
      </ThemeProvider>
      <Box component="footer" sx={classes.footer}>
        Copyright © 2022 NEX10 Labs Pte Ltd. All Rights Reserved.
      </Box>
    </>
  );
}
