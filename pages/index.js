//react/next/packages
import { useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import UULogo from "../public/images/uu/uu-logo.png";
import UUMain from "../public/images/uu/uu-main.png";
import SSLogo from "../public/images/ss/ss-logo.png";
import SSMain from "../public/images/ss/ss-main.png";
//components
import Layout from "../components/Layout";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import classes from "../utils/classes";
//styling
import { Box } from "@mui/system";
import { Button, Card } from "@mui/material";
import styled from "styled-components";
import { Colors, Devices } from "../utils/Theme";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  @media ${Devices.Laptop} {
    flex-direction: row;
  }
`;
const ParentCard = styled.div`
  > button {
    display: none;
  }
  &:hover {
    > button {
      display: flex;
    }
  }
`;
const EnterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 16px;
  font-weight: 500;
  font-family: "Oxanium";
  color: #ffffff;
  width: 70%;
  position: absolute;
  bottom: 20px;
  left: 60px;
  background: ${Colors.UUPrimary};
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
export default function Home() {
  const { isOnMainnet } = useContext(MarketplaceContext);
  const router = useRouter();
  const accessUuMarketplace = () => {
    router.push("/uu/marketplace");
  };

  //hover on marketplace
  //   const [isHovering, setIsHovering] = useState(true);
  //   const handleMouseOver = () => {
  //     setIsHovering(true);
  //   };
  //   const handleMouseOut = () => {
  //     setIsHovering(false);
  //   };

  return (
    <Layout>
      <div>
        {/* to update */}
        {!isOnMainnet ? (
          <Container>
            <Box sx={classes.marketplaceSelect}>Select Marketplace</Box>
            <Wrapper>
              <Button
                sx={classes.marketplaceUUCard}
                onClick={accessUuMarketplace}
                style={{ backgroundColor: "transparent" }}
                disableRipple
              >
                <ParentCard>
                  <Image src={UUMain} alt="UU Main" width={378} height={378} />
                  <Card sx={classes.logoImg}>
                    <Image src={UULogo} alt="UU Logo" width={310} />
                  </Card>
                  <EnterButton>Enter</EnterButton>
                </ParentCard>
                {/*  <button
                  sx={isHovering ? classes.enterMarketplace : classes.hidden}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  Hover me
               </button> */}
              </Button>
              <Card sx={classes.marketplaceSSCard}>
                <div>
                  <Image src={SSMain} alt="SS Main" width={378} height={378} />
                  <Card sx={classes.ssLogoImg}>
                    <Image src={SSLogo} alt="SS Logo" width={310} />
                  </Card>
                </div>
              </Card>
            </Wrapper>
          </Container>
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
