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
//components/utils/context
import { getError } from "../../utils/error";

//environment
import { environmentTest } from "../../lib/environments/environment";
import { environment } from "../../lib/environments/environment.prod";
//contracts
import escrowContract from "../../lib/contracts/EscrowWallet.json";
import ucdContract from "../../lib/contracts/UniCandy.json";

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

const escrowContractAddress = escrowContract.address[4]; //currently on rinkeby
const ucdContractAddress =
  process.env.NODE_ENV === "prod"
    ? ucdContract.address[environment.chainId]
    : ucdContract.address[environmentTest.chainId];
const ucdContractABI = ucdContract.abi;

let signer, provider;

const CheckContractApproval = (props) => {
  //open dialog
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isApproved, setIsApproved] = useState(false);
  const handleDialogClose = (extra = false) => {
    //if yes run this
    if (isApproved || extra === true) {
      props.setOpenDialog("second");
    } else {
      props.setOpenDialog(null);
    }
  };

  //create contract
  async function createContract() {
    return new ethers.Contract(ucdContractAddress, ucdContractABI, signer);
  }
  //approve transfer
  //open contract dialog
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
    <Dialog
      open={props.openDialog === "first"}
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
  );
};

export default CheckContractApproval;
