//react/next
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
//image
import Image from 'next/image';
import UcdCoin from '../../public/images/uu/ucd-coin.png';
import UcdRoundLogo from '../../public/images/uu/uu-round-logo.png';
//style
import styled from 'styled-components';
import { Colors, Devices } from '../../utils/Theme';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import classes from '../../utils/classes';
//components
import Layout from '../../components/Layout';
// import CheckContractApproval from "../components/CheckContractApproval";
import { MarketplaceContext } from '../../utils/MarketplaceContext';
import db from '../../utils/db';
import Product from '../../models/Product.model';
import { Store } from '../../utils/Store';
import ProductItem from '../../components/ProductItem';

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
  background: #152266;
  border-radius: 20px;
  padding: 8px 15px;
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
  font-family: 'Oxanium', > img {
    margin-right: 2px;
  }
`;
const WalletUULogo = styled.div`
  margin-right: 10px;
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
  color: #ffffff;
  font-family: Oxanium;
  font-size: 12px;
`;
const FilterButton = styled.button`
  border: 2px solid ${Colors.bg};
  padding: 10px 20px;
  border-radius: 3em;
  background-color: ${(props) => {
    return props.active ? '#152266' : 'transparent';
  }};
  color: #ffffff;
  cursor: pointer;
  font-family: Oxanium;
  font-size: 14px;
  text-align: center;
  :hover {
    background-color: ${Colors.bg};
  }
  &:active {
    background-color: ${Colors.bg};
  }
`;

export default function Search(props) {
  //state
  const [isLoading, setIsLoading] = useState(true);

  const { products } = props;
  const { isOnMainnet, ucdWalletBalance, getUCDBalance } =
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
    window.addEventListener('load', handleLoading);
    return () => window.removeEventListener('load', handleLoading);
  }, [getUCDBalance]);

  return (
    <Layout title="Search">
      <div>
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
                    {ucdWalletBalance} UCD
                  </WalletAmount>
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
          </div>
        ) : (
          <Box sx={classes.wrongNetwork}>
            You are not on the correct network. Switch to Ethereum Mainnet to
            bid.
          </Box>
        )}
      </div>
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
