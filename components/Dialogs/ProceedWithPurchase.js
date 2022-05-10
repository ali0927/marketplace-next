//react/next
import React, { useState } from "react";
//material ui
import { CircularProgress, Dialog, DialogActions } from "@mui/material";
//styles
import styled from "styled-components";
import { Colors } from "../../utils/Theme";
import classes from "../../utils/classes";
//components
import Particulars from "./Particulars";
import PaymentForm from "../PaymentForm";

const DialogText = styled.div`
  line-height: 150%;
  font-size: 17px;
  font-family: "Oxanium";
  font-weight: 700;
  margin-top: 1em;
  margin-bottom: 1em;
  color: #fff;
  text-align: center;
`;
const DialogLoading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #fff;
  font-family: "Oxanium";
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
  max-width: 200px;
  background: ${Colors.bg};
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
function ProceedWithPurchase(props) {
  //open dialog
  //   const [openDialog, setOpenDialog] = useState(props.openDialog);
  const [isLoading, setIsLoading] = useState(false);
  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  return (
    <Dialog
      open={props.openDialog === "second"}
      onClose={handleDialogClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {isLoading ? (
        <DialogLoading>
          Loading Permissions
          <CircularProgress />
        </DialogLoading>
      ) : (
        <>
          <DialogText>Ready to proceed with your purchase(s)?</DialogText>

          <DialogActions sx={classes.approveContract}>
            <Particulars>
              <PaymentForm />
            </Particulars>

            <DialogButton onClick={handleDialogClose}>
              No, Let Me Think Again{" "}
            </DialogButton>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default ProceedWithPurchase;
