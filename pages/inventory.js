//react/next/packages
import React, { useEffect, useReducer, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { getError } from '../utils/error';
import Image from 'next/image';
import UcdCoin from '../public/images/uu/ucd-coin.png';
import styled from 'styled-components';
import { Colors, Devices } from '../utils/Theme';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Box } from '@mui/system';
import classes from '../utils/classes';
import Layout from '../components/Layout';
import { MarketplaceContext } from '../utils/MarketplaceContext';
import ucdContract from '../lib/contracts/UniCandy.json';
import { environment } from '../lib/environments/environment.prod';
import { environmentTest } from '../lib/environments/environment';

const Wrapper = styled.div`
  margin-top: 150px;
`;
const Container = styled.div`
  position: relative;
  height: 100vh;
  text-align: center;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px;
  @media ${Devices.Tablet} {
    flex-direction: row;
  }
`;
const HeaderMarketplace = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const HeaderText = styled.div`
  font-size: 38px;
  font-weight: 600;
  font-family: 'Oxanium';
`;
const WalletGeneralInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media ${Devices.MobileL} {
    justify-content: center;
    flex-direction: column;
  }
`;
const WalletBalance = styled.div`
display: flex;
flex-direction: row;
  background: #152266;
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 14px;
  font-family: "Oxanium",
  display: flex;
  letter-spacing: 1px;
  margin-left: auto;
  align-items: center;
  color: #fff;
`;
const WalletText = styled.span`
  font-size: 12px;
  margin-right: 30px;
  color: '#c4c4c4';
  font-weight: 400;
  font-family: 'Oxanium';
`;
const WalletAmount = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  font-family: 'Oxanium';
  > img {
    margin-right: 2px;
  }
`;
const WalletUULogo = styled.div`
  margin-right: 10px;
`;
const Trapezium = styled.div`
  padding: 5px 8px;
  background: ${Colors.bg};
  border-top: none;
  border-bottom-right-radius: 1em 2em;
  border-bottom-left-radius: 1em 2em;
  position: absolute;
  left: 50%;
  top: -8%;
  transform: translate(-50%, -50%);
  z-index: 10;
  font-family: 'Oxanium';
  & p {
    margin-top: 55px;
    text-align: center;
  }
`;
const ProductName = styled.div`
  color: '#ffffff';
  font-size: '14px';
  font-family: 'Oxanium';
`;
const ProductPrice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'Oxanium';
`;
const ProductCost = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-inline: 5px;
  font-family: 'Oxanium';
`;
const ProductCurrency = styled.div`
  font-size: 14px;
  align-self: end;
  color: #c4c4c4;
  font-family: 'Oxanium';
`;
const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Oxanium';
`;
const NoStock = styled.button`
  background-color: ${Colors.Dialog};
  width: 100%;
  text-align: center;
  border-radius: 40px;
  color: #ffffff;
  font-size: 15px;
  padding: 6px 14px;
  font-family: 'Oxanium';
  border: none;
  cursor: default;
`;
const NoItems = styled.div`
  color: white;
  font-family: 'Oxanium';
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: 200px;
`;

const ucdContractAddress =
  process.env.NODE_ENV === 'prod'
    ? ucdContract.address[environment.chainId].toLowerCase()
    : ucdContract.address[environmentTest.chainId].toLowerCase();

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Inventory() {
  //state
  const [isLoading, setIsLoading] = useState(true);

  //context
  const { isOnMainnet, currentAccount, nex10Balance } =
    useContext(MarketplaceContext);

  //reducer
  const [{ loading, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  //loading
  const handleLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/orders/inventory?currentAccount=${currentAccount}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout>
      <Wrapper>
        {!isOnMainnet ? (
          loading ? (
            <Container>
              <CircularProgress sx={classes.loading} size={100} />
            </Container>
          ) : (
            <div>
              <HeaderContainer>
                <HeaderMarketplace>
                  <HeaderText style={{ color: 'white' }}>Inventory</HeaderText>
                </HeaderMarketplace>
                <WalletGeneralInfo>
                  <WalletBalance>
                    <WalletText style={{ color: '#c4c4c4' }}>
                      In your NEX wallet
                    </WalletText>
                    <WalletAmount>
                      <WalletUULogo>
                        <Image
                          src={UcdCoin}
                          width="20"
                          height="20"
                          alt="ucdCoin"
                        />
                      </WalletUULogo>
                      <span>{nex10Balance} UCD</span>
                    </WalletAmount>
                  </WalletBalance>
                </WalletGeneralInfo>
              </HeaderContainer>

              {orders.length > 0 && (
                <Grid
                  container
                  spacing={4}
                  alignItems="center"
                  justifyContent="center"
                >
                  {orders.map((order) => (
                    <Grid item md={3} key={order._id}>
                      <Card sx={classes.nftCard}>
                        <CardActionArea
                          disableRipple
                          sx={{ position: 'relative' }}
                        >
                          <Trapezium>
                            <p>{order.brand}</p>
                          </Trapezium>
                          <CardMedia
                            component="img"
                            image={order.image}
                            title={order.name}
                          ></CardMedia>
                          <CardContent sx={{ zIndex: '1' }}>
                            <ProductDetails>
                              <ProductName>{order.name}</ProductName>
                              <ProductPrice>
                                <Image
                                  src={UcdCoin}
                                  width="15"
                                  height="15"
                                  alt="ucdCoin"
                                />
                                <ProductCost>{order.price}</ProductCost>
                                <ProductCurrency>UCD</ProductCurrency>
                              </ProductPrice>
                            </ProductDetails>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <NoStock>
                            Purchased{' '}
                            {new Date(order.paidAt)
                              .toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                              .replace(/ /g, ' ')}
                          </NoStock>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              {orders.length === 0 && (
                <NoItems>You have no items from the marketplace.</NoItems>
              )}
            </div>
          )
        ) : (
          <Box sx={classes.wrongNetwork}>
            You are not on the correct network. Switch to Ethereum Mainnet to
            view your inventory.
          </Box>
        )}
      </Wrapper>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Inventory), { ssr: false });
