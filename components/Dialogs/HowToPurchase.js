//react/next
import React from "react";
//material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
//styles
import styled from "styled-components";
import { Colors } from "../../utils/Theme";
import classes from "../../utils/classes";

//components
const List = styled.div`
  color: #ffffff;
  font-family: "Oxanium";
`;
const Step = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 400;
`;
const Number = styled.div`
  font-size: 16px;
  padding: 5px 13px;
  background: #0097da;
  border-radius: 50%;
  margin-right: 20px;
  position: relative;
  z-index: 10;
  &: before {
    content: "";
    position: absolute;
    left: 1em;
    top: 1em;
    width: 0.1rem;
    height: 4rem;
    background: ${Colors.Primary};
    z-index: 5;
  }
`;
const NumberLast = styled.div`
  font-size: 16px;
  padding: 5px 13px;
  background: #0097da;
  border-radius: 50%;
  margin-right: 20px;
  position: relative;
  z-index: 10;
`;
const Instruction = styled.div``;

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
  background: ${Colors.Primary};
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
    props.setOpen(null);
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={classes.dialogTitle}>
        Please follow the steps below to purchase:
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <List>
            <Step>
              <Number>1</Number>
              <Instruction>
                Allow our marketplace contract to access $UCD in your metamask
                wallet. (Require one time approval fee)
              </Instruction>
            </Step>
            <Step>
              <Number>2</Number>
              <Instruction>
                Transfer $UCD from your metamask wallet to NEX wallet. (Require
                gas fee to burn the token)
              </Instruction>
            </Step>
            <Step>
              <Number>3</Number>
              <Instruction>
                You will use the $UCD in the NEX wallet to make any purchases in
                the marketplace and it’s gasless!
              </Instruction>
            </Step>
            <Step>
              <NumberLast>4</NumberLast>
              <Instruction>
                Upon a successful purchase, you can access the purchased items
                in the [Inventory] page.
              </Instruction>
            </Step>
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DialogButton onClick={handleClose}>Ok, Let&apos;s Go!</DialogButton>
      </DialogActions>
    </Dialog>
  );
}

export default HowToPurchase;
