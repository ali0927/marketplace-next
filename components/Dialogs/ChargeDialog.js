//react/next/packages
import { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
//blockchain
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
//material ui
import { Dialog, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
//styles
import styled from 'styled-components';
import classes from '../../utils/classes';
import { Colors } from '../../utils/Theme';
//components/utils/context
import { getError } from '../../utils/error';
//environment
import { environmentTest } from '../../lib/environments/environment';
import { environment } from '../../lib/environments/environment.prod';
//contracts
import escrowContract from '../../lib/contracts/EscrowWallet.json';
import ucdContract from '../../lib/contracts/UniCandy.json';

import { MarketplaceContext } from '../../utils/MarketplaceContext';
import axios from 'axios';

const DialogText = styled.div`
  line-height: 150%;
  font-size: 17px;
  font-family: 'Oxanium';
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
  font-family: 'Oxanium';
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
  font-family: 'Oxanium';
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
const DialogField = styled.div`
  background: ${Colors.bg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c4c4c4;
  border-radius: 50px;
  padding: 8px 20px;
  margin-bottom: 1em;
`;
const DialogIconBox = styled.div`
  display: flex;
  align-items: center;
`;
const AmountInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: #c4c4c4;
  font-size: 17px;
  width: 100%;
  margin-right: 10px;
`;

const escrowContractAddress = escrowContract.address[4]; //currently on rinkeby
const escrowContractABI = escrowContract.abi;
const ucdContractAddress =
  process.env.NODE_ENV === 'prod'
    ? ucdContract.address[environment.chainId].toLowerCase()
    : ucdContract.address[environmentTest.chainId].toLowerCase();
const ucdContractABI = ucdContract.abi;
const DIALOG_STATUS = {
  NONE: 'None',
  APPROVE: 'Approve',
  APPROVED: 'Approved',
  CONFIRMPURCHASE: 'ConfirmPurchase',
  DEPOSITFUND: 'DeposiFund',
  FUNDADDED: 'FundAdded',
  FILLDETAIL: 'FillDetail',
  SUBMITTED: 'Submitted',
  LOADING: 'Loading',
};

let signer, provider;

function ChargeDialog(props) {
  //state
  const { enqueueSnackbar } = useSnackbar();
  const [dialogStatus, setDialogStatus] = useState(DIALOG_STATUS.APPROVE);
  const [depositAmount, setDepositAmount] = useState(0);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [nex10Balance, setNex10Balance] = useState(0);

  //context
  const { currentAccount, ucdWalletBalance } = useContext(MarketplaceContext);

  //user approves contract to access #UCD in wallet
  const handleDialogClose = () => {
    props.setShowCharge(null);
  };

  //approve transfer
  async function setApproval() {
    const ucdContract = new ethers.Contract(
      ucdContractAddress,
      ucdContractABI,
      signer
    );
    setDialogStatus(DIALOG_STATUS.LOADING);
    console.log(ucdContract);
    await ucdContract
      .approve(
        escrowContractAddress,
        ethers.utils.parseEther(approvedAmount.toString())
      )
      .then(async (tx) => {
        tx.wait().then(async () => {
          setDialogStatus(DIALOG_STATUS.APPROVED);
          enqueueSnackbar('Permissions approved successfully', {
            variant: 'success',
          });
        });
      })
      .catch((err) => {
        handleDialogClose();
        enqueueSnackbar(getError(err), { variant: 'error' });
      });
  }

  const depositFund = async () => {
    const escrowContract = new ethers.Contract(
      escrowContractAddress,
      escrowContractABI,
      signer
    );
    setDialogStatus(DIALOG_STATUS.LOADING);
    await escrowContract
      .burnToken(
        ucdContractAddress,
        ethers.utils.parseEther(depositAmount.toString())
      )
      .then(async (tx) => {
        tx.wait().then(async () => {
          setDialogStatus(DIALOG_STATUS.FUNDADDED);
          enqueueSnackbar('Burned successfully', {
            variant: 'success',
          });
        });
      })
      .catch((err) => {
        setDialogStatus(DIALOG_STATUS.NONE);
        enqueueSnackbar(getError(err), { variant: 'error' });
      });
  };

  const getNex10Balance = async () => {
    const user = currentAccount.toLowerCase();
    const nex10balance = await axios.get(
      `/api/wallet/${user}/${ucdContractAddress}`
    );
    await setNex10Balance(nex10balance.data.balance);
  };

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      getNex10Balance();
    }
  }, []);

  return (
    <Dialog
      open={dialogStatus !== DIALOG_STATUS.NONE}
      onClose={dialogStatus === DIALOG_STATUS.NONE}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {dialogStatus === DIALOG_STATUS.LOADING && (
        <DialogLoading>Loading Permissions...</DialogLoading>
      )}

      {dialogStatus === DIALOG_STATUS.APPROVE && (
        <>
          <DialogText>
            Please allow our marketplace contract to access the $UCD in your
            wallet before you can spend you $UCD.
          </DialogText>

          <DialogField>
            <span>In your wallet</span>
            <span>{ucdWalletBalance} UCD</span>
          </DialogField>

          <DialogField>
            <span>Your NEX wallet</span>
            <span>{`${nex10Balance} UCD`}</span>
          </DialogField>

          <DialogField>
            {/* <DialogIconBox>
              {approvedAmount > 0 &&
                <RemoveIcon
                  style={{
                    fontSize: 22,
                    cursor: 'pointer',
                    color: 'white',
                  }}
                  onClick={() => setApprovedAmount(approvedAmount - 1)}
                />
              }
            </DialogIconBox> */}

            <AmountInput
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(parseFloat(e.target.value))}
            />
            <span>UCD</span>

            {/* <DialogIconBox>
              {approvedAmount < parseFloat(ucdWalletBalance.replaceAll(',', '')) &&
                <AddIcon
                  style={{
                    fontSize: 22,
                    cursor: 'pointer',
                    color: 'white',
                  }}
                  onClick={() => setApprovedAmount(approvedAmount + 1)}
                />
              }
            </DialogIconBox> */}
          </DialogField>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              disableRipple
              onClick={setApproval}
              sx={classes.dialogApprovalButton}
            >
              Approve
            </Button>
            <DialogButton onClick={handleDialogClose}>Cancel</DialogButton>
          </DialogActions>
        </>
      )}

      {dialogStatus === DIALOG_STATUS.APPROVED && (
        <>
          <DialogText>Approved successfully!</DialogText>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              disableRipple
              onClick={() => setDialogStatus(DIALOG_STATUS.DEPOSITFUND)}
              sx={classes.dialogApprovalButton}
            >
              Continue
            </Button>
          </DialogActions>
        </>
      )}

      {dialogStatus === DIALOG_STATUS.DEPOSITFUND && (
        <>
          <DialogText>Deposit fund to your NEX wallet.</DialogText>

          <DialogField>
            <span>Approved amount</span>
            <span>{approvedAmount} UCD</span>
          </DialogField>

          <DialogField>
            <span>Your NEX wallet</span>
            <span>{`${nex10Balance} UCD`}</span>
          </DialogField>

          <DialogText>Amount to add</DialogText>
          <DialogField>
            <AmountInput
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
            />
            <span>UCD</span>
          </DialogField>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              onClick={depositFund}
              sx={classes.dialogApprovalButton}
            >
              Confirm
            </Button>
            <DialogButton onClick={handleDialogClose}>Cancel</DialogButton>
          </DialogActions>
        </>
      )}

      {dialogStatus === DIALOG_STATUS.FUNDADDED && (
        <>
          <DialogText>Fund added successfully!</DialogText>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              disableRipple
              onClick={handleDialogClose}
              sx={classes.dialogApprovalButton}
            >
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default ChargeDialog;
