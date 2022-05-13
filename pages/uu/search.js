//react/next

import { Colors, Devices } from '../../utils/Theme';
import { useContext, useEffect, useState } from 'react';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Box } from '@mui/system';
import ChargeDialog from '../../components/Dialogs/ChargeDialog';
import { Grid } from '@mui/material';
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
import styled from 'styled-components';
import { useRouter } from 'next/router';
import ucdContract from '../../lib/contracts/UniCandy.json';
import { environment } from '../../lib/environments/environment.prod';
import { environmentTest } from '../../lib/environments/environment';

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
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 14px;
  font-family: "Oxanium",
  display: flex;
  letter-spacing: 1px;
  margin-left: 15px;
  color: #fff;
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

export default function Search(props) {
  //state
  const [isLoading, setIsLoading] = useState(true);
  const [nex10Balance, setNex10Balance] = useState(0);
  const [showCharge, setShowCharge] = useState(false);

  const { products } = props;
  const { isOnMainnet, ucdWalletBalance, getUCDBalance, currentAccount } =
    useContext(MarketplaceContext);
  const { state, dispatch } = useContext(Store);

  //filter
  const router = useRouter();
  const queryUrl = router.query.type;
  const allFilter = () => {
    router.push('/uu/marketplace');
  };
  const whitelistFilter = () => {
    router.push('/uu/search?type=Whitelist');
  };
  const raffleFilter = () => {
    router.push('/uu/search?type=Raffle');
  };

  const handleLoading = () => {
    setIsLoading(false);
  };

  const getNex10balance = async () => {
    const user = currentAccount.toLowerCase();
    const nex10balance = await axios.get(
      `/api/wallet/${user}/${ucdContractAddress}`
    );
    setNex10Balance(nex10balance.data.balance);
  };

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  useEffect(() => {
    getNex10balance();
  }, [currentAccount, showCharge]);

  return (
    <Layout title="Search">
      <Wrapper>
        {!isOnMainnet ? (
          <div>
            <HeaderContainer>
              <HeaderMarketplace>
                <HeaderText style={{ color: 'white' }}>Marketplace</HeaderText>
                <Image
                  src={UcdRoundLogo}
                  alt="UcdRoundLogo"
                  width={38}
                  height={38}
                />
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
                <WalletBalance
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowCharge(true)}
                >
                  <AccountBalanceWalletOutlinedIcon
                    style={{
                      fontSize: 22,
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  />
                  <span>Charge</span>
                </WalletBalance>
              </WalletGeneralInfo>
            </HeaderContainer>
            <FilterContainer>
              <FilterText>Filter By:</FilterText>
              <FilterButton onClick={allFilter}>All</FilterButton>
              <FilterButton
                onClick={whitelistFilter}
                active={queryUrl === 'Whitelist'}
              >
                Whitelist
              </FilterButton>
              <FilterButton
                onClick={raffleFilter}
                active={queryUrl === 'Raffle'}
              >
                NFT Raffle
              </FilterButton>
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
      </Wrapper>
    </Layout>
  );
}

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
