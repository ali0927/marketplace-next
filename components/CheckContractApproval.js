//react
import { useState, useEffect } from "react";
//blockchain
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
//material ui
import { Dialog, DialogActions } from "@mui/material";
//styles
import styled from "styled-components";
import { Colors } from "../utils/Theme";
//toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//environment
import { environmentTest } from "../lib/environments/environment";
import { environment } from "../lib/environments/environment.prod";
//contracts
import uniVoxelContract from "../lib/contracts/UninterestedUnicornsV3.json";
import ucdContract from "../lib/contracts/UniCandy.json";

const DialogTitle = styled.div`
  font-size: 24px;
  margin-top: 0;
  color: ${Colors.Primary};
  font-weight: 700;
`;

const DialogText = styled.div`
  line-height: 150%;
  font-size: 16px;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const DialogApproveButton = styled.div`
  width: 200px;
  margin-right: 30px;
  cursor: pointer;
  color: #fff;
  background: ${Colors.Background};
  box-shadow: 0 0 14px rgb(112 51 213 / 80%);
  padding: 20px 20px;
  border-radius: 40px;
  font-size: 18px;
  text-decoration: none;
  transition: 0.3s ease-in-out background-position;
  text-transform: uppercase;
  text-align: center;
  outline: none;
`;

const DialogButton = styled.div`
  width: 200px;
  font-size: 18px;
  cursor: pointer;
  text-transform: uppercase;
`;

//variables
const uniGen3ContractAddress = uniVoxelContract.address; //currently on rinkeby
const uniGen3ContractAbi = uniVoxelContract.abi;
const ucdContractAddress = ucdContract.address[environmentTest.chainId]; //to update
const ucdContractABI = ucdContract.abi;

let signer, provider;
// toast.configure();

const CheckContractApproval = (props) => {
  const [openDialog, setOpenDialog] = useState(props.openDialog);
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  /**
   * Function to create a contract based on address, abi, and signer
   */
  async function createContract() {
    return new ethers.Contract(ucdContractAddress, ucdContractABI, signer);
  }

  /**
   * Set approval for transfer of tokens
   */
  async function setApproval() {
    const contract = await createContract();

    await contract
      .approve(uniGen3ContractAddress, ethers.constants.MaxUint256)
      .then(async (tx) => {
        setIsLoading(true);
        tx.wait().then((success) => {
          setIsLoading(false);
          handleDialogClose();
          toast.success("Permissions approved successfully");
        });
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // Check if Ethereum is enabled via metamask or some other provider
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what Metamask injects as window.ethereum into each page
      provider = new ethers.providers.Web3Provider(window.ethereum);

      // The Metamask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
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
      <DialogTitle>Requesting Permission</DialogTitle>
      {isLoading ? (
        <DialogText>Loading Permissions...</DialogText>
      ) : (
        <>
          <DialogText>
            We need your approval in order to exchange UCD/SHO tokens for Nex10
            services.
          </DialogText>

          <DialogActions>
            <DialogApproveButton autoFocus onClick={setApproval}>
              Approve
            </DialogApproveButton>
            <DialogButton onClick={handleDialogClose}>Cancel</DialogButton>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default CheckContractApproval;
