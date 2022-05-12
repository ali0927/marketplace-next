//react/next/packages
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
//blockchain
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
//material ui
import { Dialog, DialogActions } from "@mui/material";
import Button from "@mui/material/Button";
//styles
import styled from "styled-components";
import classes from "../../utils/classes";
import { Colors } from "../../utils/Theme";
//components/utils/context
import { getError } from "../../utils/error";
//environment
import { environmentTest } from "../../lib/environments/environment";
import { environment } from "../../lib/environments/environment.prod";
//contracts
import escrowContract from "../../lib/contracts/EscrowWallet.json";
import ucdContract from "../../lib/contracts/UniCandy.json";
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

const escrowContractAddress = escrowContract.address[4]; //currently on rinkeby
const ucdContractAddress =
  process.env.NODE_ENV === "prod"
    ? ucdContract.address[environment.chainId]
    : ucdContract.address[environmentTest.chainId];
const ucdContractABI = ucdContract.abi;

let signer, provider;

function PurchaseDialog(props) {
  //state
  //   const [showPurchase, setShowPurchase] = useState(""); //first dialog (user to approve purchase)
  const [proceedPurchase, setProceedPurchase] = useState(false); //second dialog (detect if funds in escrow walet is sufficient)
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isApproved, setIsApproved] = useState(false);

  //user approves contract to access #UCD in wallet
  const handleDialogClose = (extra = false) => {
    if (isApproved || extra === true) {
      //open "approved successfully dialog"
      props.setShowPurchase(null);
      setProceedPurchase(true);
    } else {
      props.setShowPurchase(null);
    }
  };
  //user to proceed with purchase
  const handleProceedDialogClose = () => {
    setProceedPurchase(false);
  };

  //create contract
  async function createContract() {
    return new ethers.Contract(ucdContractAddress, ucdContractABI, signer);
  }
  //approve transfer
  async function setApproval() {
    const contract = await createContract();

    await contract
      .approve(escrowContractAddress, ethers.constants.MaxUint256)
      .then(async (tx) => {
        setIsLoading(true);
        tx.wait().then(async () => {
          await setIsApproved(true);
          setIsLoading(false);
          handleDialogClose(true);
          enqueueSnackbar("Permissions approved successfully", {
            variant: "success",
          });
        });
      })
      .catch((err) => {
        setIsLoading(false);
        enqueueSnackbar(getError(err), { variant: "error" });
      });
  }

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
    }
  }, []);

  return (
    <div>
      {props.showPurchase ? (
        <Dialog
          open={props.showPurchase}
          onClose={handleDialogClose}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          {isLoading ? (
            <DialogLoading>Loading Permissions...</DialogLoading>
          ) : (
            <>
              <DialogText>
                Please allow our marketplace contract to access the $UCD in your
                wallet before you can spend you $UCD.
              </DialogText>

              <DialogActions sx={classes.approveContract}>
                <Button
                  autoFocus
                  disableRipple
                  onClick={setApproval}
                  sx={classes.dialogApprovalButton}
                >
                  Approve
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      ) : (
        <></>
      )}
      {proceedPurchase ? (
        <Dialog
          open={proceedPurchase}
          onClose={handleProceedDialogClose}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <DialogText>Ready to proceed with your purchase(s)?</DialogText>

          <DialogActions sx={classes.approveContract}>
            <Particulars>
              <PaymentForm />
            </Particulars>

            <DialogButton onClick={handleProceedDialogClose}>
              No, Let Me Think Again{" "}
            </DialogButton>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
}

export default PurchaseDialog;
