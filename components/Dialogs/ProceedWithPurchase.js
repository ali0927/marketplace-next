//react/next
import React, { useState } from "react";
//material ui
import { CircularProgress, Dialog, DialogActions } from "@mui/material";
//styles
import styled from "styled-components";
import { Colors } from "../../utils/Theme";
import classes from "../../utils/classes";
const DialogText = styled.div`
  line-height: 150%;
  font-size: 16px;
  margin-top: 1em;
  margin-bottom: 1em;
  color: #fff;
`;

const DialogLoading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #fff;
`;

const DialogApproveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  color: #ffffff;
  max-width: 200px;
  background: ${Colors.Primary};
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

const DialogButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 1rem 1.5rem;
  font-weight: 500;
  font-size: 13px;
  color: #ffffff;
  max-width: 200px;
  background: ${Colors.bg};
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
            <DialogApproveButton autoFocus>Absolutely Yes!</DialogApproveButton>
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
