//react/next/packages
import { useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
//blockchain
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
//material ui
import { CircularProgress, Dialog, DialogActions } from "@mui/material";
//styles
import styled from "styled-components";
import { Colors } from "../utils/Theme";
import classes from "../utils/classes";
//components/utils/context
import { MarketplaceContext } from "../utils/MarketplaceContext";
import { getError } from "../utils/error";
//environment
import { environmentTest } from "../lib/environments/environment";
import { environment } from "../lib/environments/environment.prod";
//contracts
import escrowContract from "../lib/contracts/EscrowWallet.json";
import ucdContract from "../lib/contracts/UniCandy.json";

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
  padding: 0.5rem 1.5rem;
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

// const DialogButton = styled.div`
//   width: 200px;
//   font-size: 18px;
//   cursor: pointer;
//   text-transform: uppercase;
// `;

const escrowContractAddress = escrowContract.address; //currently on rinkeby
const ucdRinkebyContractAddress = ucdContract.address[environmentTest.chainId];
const ucdContractAddress = ucdContract.address[environment.chainId];
const ucdContractABI = ucdContract.abi;

let signer, provider;

const CheckContractApproval = (props) => {
  //open dialog
  // const [openDialog, setOpenDialog] = useState(props.openDialog);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  //create contract
  const { isOnMainnet, checkChain } = useContext(MarketplaceContext);
  async function createContract() {
    await checkChain();
    console.log("isOnMainnet? ", isOnMainnet);
    if (isOnMainnet) {
      return new ethers.Contract(ucdContractAddress, ucdContractABI, signer);
    }
    if (!isOnMainnet) {
      return new ethers.Contract(
        ucdRinkebyContractAddress,
        ucdContractABI,
        signer
      );
    }
  }
  //approve transfer
  async function setApproval() {
    const contract = await createContract();

    await contract
      .approve(escrowContractAddress, ethers.constants.MaxUint256)
      .then(async (tx) => {
        setIsLoading(true);
        tx.wait().then(() => {
          setIsLoading(false);
          handleDialogClose();
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
    <Dialog
      open={props.openDialog}
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
          <DialogText>
            Please allow our marketplace contract to access the $UCD in your
            wallet before you can spend you $UCD.
          </DialogText>

          <DialogActions sx={classes.approveContract}>
            <DialogApproveButton autoFocus onClick={setApproval}>
              Approve
            </DialogApproveButton>
            {/* <DialogButton onClick={handleDialogClose}>Cancel</DialogButton> */}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default CheckContractApproval;
