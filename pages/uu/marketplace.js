//react/next
import { Colors, Devices } from '../../utils/Theme';
import { useContext, useEffect, useState } from 'react';
import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Box } from '@mui/system';
import ChargeDialog from '../../components/Dialogs/ChargeDialog';
import { Avatar, Button, Grid, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { MarketplaceContext } from '../../utils/MarketplaceContext';
import Product from '../../models/Product.model';
import ProductItem from '../../components/ProductItem';
import { Store } from '../../utils/Store';
import UcdCoin from '../../public/images/uu/ucd-coin.png';
import UcdRoundLogo from '../../public/images/uu/uu-round-logo.png';
import axios from 'axios';
import classes from '../../utils/classes';
import db from '../../utils/db';
import { environment } from '../../lib/environments/environment.prod';
import { environmentTest } from '../../lib/environments/environment';
import styled from 'styled-components';
import ucdContract from '../../lib/contracts/UniCandy.json';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  margin-top: 150px;
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
const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${Devices.Tablet} {
    flex-direction: row;
    gap: 0.5rem;
  }
`;
const WalletGeneralInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media ${Devices.MobileL} {
    justify-content: center;
  }
`;
const WalletBalance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #152266;
  border-radius: 50px;
  padding: 10px 100px;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 14px;
  font-family: "Oxanium",
  display: flex;
  letter-spacing: 1px;
  color: #fff;
  @media ${Devices.Tablet} {
    padding: 10px 35px;
    display: flex;
    flex-direction: row;
    gap: 40px;
  }
`;
const WalletText = styled.span`
  font-size: 12px;
  color: '#c4c4c4';
  font-weight: 400;
  font-family: 'Oxanium';
`;
const WalletAmount = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Oxanium';
  > img {
    margin-right: 2px;
  }
`;
const WalletUULogo = styled.div`
  margin-right: 10px;
  margin-bottom: 5px;
  display: flex;
`;
const Caption = styled.div`
  color: #ffffff;
  font-family: Oxanium;
  text-align: center;
  text-transform: none;
`;
const FilterContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  @media ${Devices.Laptop} {
    justify-content: flex-start;
  }
`;
const FilterText = styled.div`
  display: none;
  color: #ffffff;
  font-family: Oxanium;
  font-size: 12px;
  @media ${Devices.MobileL} {
    display: block;
  }
`;
const FilterButton = styled.button`
  border: 2px solid ${Colors.bg};
  padding: 10px 20px;
  border-radius: 3em;
  cursor: pointer;
  font-family: Oxanium;
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  background-color: ${(props) => (props.color ? props.color : 'transparent')};
  :hover {
    background-color: ${Colors.bg};
  }
  &.active {
    background-color: ${Colors.bg};
  }
`;

const ucdContractAddress =
  process.env.NODE_ENV === 'prod'
    ? ucdContract.address[environment.chainId].toLowerCase()
    : ucdContract.address[environmentTest.chainId].toLowerCase();

export default function Home(props) {
  const isTablet = useMediaQuery('(min-width:900px)');
  const { products } = props;
  //state
  const [isLoading, setIsLoading] = useState(true);
  const [showCharge, setShowCharge] = useState(false);

  //context
  const { isOnMainnet, currentAccount, nex10Balance } =
    useContext(MarketplaceContext);
  const { state, dispatch } = useContext(Store);

  //filter
  const router = useRouter();
  const allFilter = () => {
    router.push('/uu/marketplace');
  };
  const whitelistFilter = () => {
    router.push('/uu/search?type=Whitelist');
  };
  const raffleFilter = () => {
    router.push('/uu/search?type=Raffle');
  };
  //inventory
  const inventoryHandler = () => {
    router.push('/inventory');
  };

  //loading
  const handleLoading = () => {
    setIsLoading(false);
  };

  //add to cart
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  useEffect(() => {}, [currentAccount, showCharge]);

  return (
    <Layout title="UU Marketplace">
      <Wrapper>
        <div>
          {!isOnMainnet ? (
            <div>
              <HeaderContainer>
                <HeaderMarketplace>
                  <HeaderText style={{ color: 'white' }}>
                    Marketplace
                  </HeaderText>
                  <Image
                    src={UcdRoundLogo}
                    alt="UcdRoundLogo"
                    width={38}
                    height={38}
                  />
                </HeaderMarketplace>
                <WalletWrapper>
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Button
                        onClick={() => setShowCharge(true)}
                        fullWidth
                        sx={classes.mobileHeaderIcons}
                      >
                        <Avatar sx={classes.avatar}>
                          <AccountBalanceWalletOutlinedIcon
                            style={{ fontSize: 22 }}
                          />
                        </Avatar>
                        <Caption>Top Up</Caption>
                      </Button>
                    </div>

                    <div style={{ marginLeft: '10px' }}>
                      <Button
                        onClick={inventoryHandler}
                        fullWidth
                        sx={
                          isTablet
                            ? classes.hidden
                            : classes.mobileHeaderIconsVisible
                        }
                      >
                        <Avatar sx={classes.avatar}>
                          <TakeoutDiningOutlinedIcon style={{ fontSize: 22 }} />
                        </Avatar>
                        <Caption>Inventory</Caption>
                      </Button>
                    </div>
                  </div>
                </WalletWrapper>
              </HeaderContainer>
              <FilterContainer>
                <FilterText>Filter By:</FilterText>
                <FilterButton color={'#152266'} onClick={allFilter}>
                  All
                </FilterButton>
                <FilterButton onClick={whitelistFilter}>Whitelist</FilterButton>
                <FilterButton onClick={raffleFilter}>NFT Raffle</FilterButton>
              </FilterContainer>
              <Grid
                container
                spacing={4}
                alignItems="center"
                justifyContent="center"
              >
                {products.map((product) => (
                  <Grid item md={3} key={product.slug}>
                    <ProductItem
                      product={product}
                      addToCartHandler={addToCartHandler}
                    />
                  </Grid>
                ))}
              </Grid>
              {showCharge && (
                <ChargeDialog
                  showCharge={showCharge}
                  setShowCharge={setShowCharge}
                />
              )}
            </div>
          ) : (
            <Box sx={classes.wrongNetwork}>
              You are not on the correct network. Switch to Ethereum Mainnet to
              bid.
            </Box>
          )}
        </div>
      </Wrapper>
    </Layout>
  );
}

//server side props (filter function)
export async function getServerSideProps({ query }) {
  await db.connect();
  const type = query.type || '';
  const typeFilter = type && type !== 'all' ? { type } : {};
  const types = await Product.find().distinct('type');
  const productDocs = await Product.find({
    ...typeFilter,
  }).lean();
  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      types,
    },
  };
}
