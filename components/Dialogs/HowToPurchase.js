//react/next
import React from "react";
//material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from "@mui/material";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BentoOutlinedIcon from "@mui/icons-material/BentoOutlined";
//styles
import styled from "styled-components";
import { Colors } from "../../utils/Theme";
import classes from "../../utils/classes";

//components
const Item = styled.div`
  color: #ffffff;
  font-family: "Oxanium";
  background: #152266;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Step = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${Colors.UUPrimary};
`;
const SubTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 400;
  padding-bottom: 8px;
  border-bottom: 2px solid ${Colors.UUPrimary};
`;
const Number = styled.div`
  font-size: 13px;
  padding: 3px 10px;
  background: ${Colors.UUPrimary};
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  z-index: 10;
  color: ${Colors.bg};
  font-weight: 700;
  text-align: center;
`;

const Info = styled.div`
  display: flex;
`;
const Instruction = styled.div`
  font-size: 11px;
  width: 95%;
  margin-right: 5px;
`;

const DialogButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0.7rem 1.5rem;
  font-weight: 500;
  font-size: 13px;
  font-family: "Oxanium";
  color: #ffffff;
  max-width: 220px;
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

function HowToPurchase(props) {
  //handle Clicks
  const handleClose = () => {
    props.setOpen(false);
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={classes.dialogTitle}>
        Here’s a quick guide for you before proceed to make any purchase.
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <Item>
                <SubTitle>
                  <Number>1</Number>
                  <Step>Contract Approval</Step>
                </SubTitle>
                <Info>
                  <Instruction>
                    Allow our marketplace contract to access $UCD in your
                    metamask wallet.
                    <br />
                    (Require one time approval fee)
                  </Instruction>
                  <FactCheckOutlinedIcon
                    style={{
                      fontSize: 35,
                      color: "#F333CB",
                      alignSelf: "flex-end",
                      marginTop: "5px",
                    }}
                  />
                </Info>
              </Item>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Item>
                <SubTitle>
                  <Number>2</Number>
                  <Step>Deposit $UCD to NEX wallet</Step>
                </SubTitle>
                <Info>
                  <Instruction>
                    Transfer any amount of $UCD from your metamask wallet to NEX
                    wallet. The $UCD in your metamask wallet will be burnt.
                    <br />
                    (Require gas fee)
                  </Instruction>
                  <AccountBalanceWalletOutlinedIcon
                    style={{
                      fontSize: 35,
                      color: "#F333CB",
                      alignSelf: "flex-end",
                      marginTop: "5px",
                    }}
                  />
                </Info>
              </Item>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Item>
                <SubTitle>
                  <Number>3</Number>
                  <Step>Purchase items using NEX wallet</Step>
                </SubTitle>
                <Info>
                  <Instruction>
                    You will use the $UCD amount in the NEX wallet to make any
                    purchases in the marketplace and it’s gasless!
                  </Instruction>
                  <ShoppingCartOutlinedIcon
                    style={{
                      fontSize: 35,
                      color: "#F333CB",
                      alignSelf: "flex-end",
                      marginTop: "5px",
                    }}
                  />
                </Info>
              </Item>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Item>
                <SubTitle>
                  <Number>4</Number>
                  <Step>Check your inventory</Step>
                </SubTitle>
                <Info>
                  <Instruction>
                    Upon a successful purchase, you can check your purchased
                    items in the [Inventory] page.
                  </Instruction>
                  <BentoOutlinedIcon
                    style={{
                      fontSize: 35,
                      color: "#F333CB",
                      alignSelf: "flex-end",
                      marginTop: "5px",
                    }}
                  />
                </Info>
              </Item>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DialogButton onClick={handleClose}>Understand!</DialogButton>
      </DialogActions>
    </Dialog>
  );
}

export default HowToPurchase;
