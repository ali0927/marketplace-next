//react/next
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
//components
import Layout from "../components/Layout";
import CheckContractApproval from "../components/CheckContractApproval";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import db from "../utils/db";
import Product from "../models/Product";
import { Store } from "../utils/Store";
//image
import Image from "next/image";
import UcdLogo from "../public/images/uu/candy.png";
import ShoLogo from "../public/images/ss/token.png";
//style
import styled from "styled-components";
import { Colors, Devices } from "../utils/Theme";
import { Grid } from "@mui/material";
import ProductItem from "../components/ProductItem";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  color: ${Colors.White};
  width: max-content;
  background: linear-gradient(
    to right,
    ${Colors.Gradients.PrimaryToSec[0]},
    ${Colors.Gradients.PrimaryToSec[1]}
  );
  border-radius: ${(p) => (p.round ? "50px" : "5px")};
`;

const WrongNetwork = styled.div`
  text-align: center;
  font-size: 18px;
  line-height: 160%;
  margin: 50px auto;
  width: 500px;
  line-height: 180%;
  @media ${Devices.Laptop} {
    width: calc(100% - 40px);
  }
`;
/**
 *  Wallet
 **/
const WalletListContainer = styled.div`
  width: 1000px;
  margin: 20px auto;
  margin-right: 0px;
  justify-self: end;
  @media ${Devices.LaptopL} {
    width: 800px;
  }
  @media ${Devices.Tablet} {
    width: 500px;
  }
  @media ${Devices.MobileL} {
    width: 300px;
  }
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
  background: #203040;
  border-radius: 20px;
  padding: 10px 20px;
  margin-bottom: 20px;
  fonr-weight: 700;
  font-size: 14px;
  display: flex;
  letter-spacing: 1px;
  margin-left: auto;
  align-items: center;
  text-transform: uppercase;
  /* @media ${Devices.MobileL} {
    width: 100%;
  } */
`;

const WalletText = styled.span`
  font-size: 12px;
  margin-right: 40px;
`;

const WalletAmount = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;

  > img {
    margin-right: 5px;
  }
`;

const WalletUULogo = styled.div`
  margin-right: 10px;
`;

export default function Home(props) {
  const { products } = props;
  const {
    isOnMainnet,
    ucdWalletBalance,
    getUCDBalance,
    shoWalletBalance,
    getSHOBalance,
  } = useContext(MarketplaceContext);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleLoading = () => {
    setIsLoading(false);
  };

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  useEffect(() => {
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, [getUCDBalance, getSHOBalance]);
  return (
    <Layout>
      <div>
        {isOnMainnet ? (
          <div>
            <div style={{ display: "flex" }}>
              <WalletListContainer>
                <WalletGeneralInfo>
                  <WalletBalance>
                    <WalletText>SHO Wallet</WalletText>
                    <WalletAmount>
                      <WalletUULogo>
                        <Image
                          src={ShoLogo}
                          width="20"
                          height="20"
                          alt="shoLogo"
                        />
                      </WalletUULogo>
                      {shoWalletBalance} SHO
                    </WalletAmount>
                  </WalletBalance>
                </WalletGeneralInfo>
              </WalletListContainer>
              <WalletListContainer style={{ marginLeft: "20px" }}>
                <WalletGeneralInfo>
                  <WalletBalance>
                    <WalletText>UCD Wallet</WalletText>
                    <WalletAmount>
                      <WalletUULogo>
                        <Image
                          src={UcdLogo}
                          width="20"
                          height="20"
                          alt="ucdLogo"
                        />
                      </WalletUULogo>
                      {ucdWalletBalance} UCD
                    </WalletAmount>
                  </WalletBalance>
                </WalletGeneralInfo>
              </WalletListContainer>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>Products</h1>
              <Button round onClick={handleOpenDialog}>
                Approve
              </Button>
              <CheckContractApproval
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              />
            </div>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item md={4} key={product.name}>
                  <ProductItem
                    product={product}
                    addToCartHandler={addToCartHandler}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <WrongNetwork>
            You are not on the correct network. Switch to Ethereum Mainnet to
            bid.
          </WrongNetwork>
        )}
      </div>
    </Layout>
  );
}

//server side props
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: { products: products.map(db.convertDocToObj) },
  };
}
