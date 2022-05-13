//react/next/packages

import { Dialog, DialogActions } from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { Colors } from '../../utils/Theme';
import { MarketplaceContext } from '../../utils/MarketplaceContext';
import MetaMaskOnboarding from '@metamask/onboarding';
import PaymentForm from '../PaymentForm';
import RemoveIcon from '@mui/icons-material/Remove';
import { Store } from '../../utils/Store';
import axios from 'axios';
import classes from '../../utils/classes';
import { environment } from '../../lib/environments/environment.prod';
import { environmentTest } from '../../lib/environments/environment';
import escrowContract from '../../lib/contracts/EscrowWallet.json';
import { ethers } from 'ethers';
import { getError } from '../../utils/error';
import styled from 'styled-components';
import ucdContract from '../../lib/contracts/UniCandy.json';
import { useSnackbar } from 'notistack';

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

function PurchaseDialog(props) {
  //state
  //   const [showPurchase, setShowPurchase] = useState(""); //first dialog (user to approve purchase)
  const [proceedPurchase, setProceedPurchase] = useState(false); //second dialog (detect if funds in escrow walet is sufficient)
  const { enqueueSnackbar } = useSnackbar();
  const [dialogStatus, setDialogStatus] = useState(DIALOG_STATUS.INIT);
  const [depositAmount, setDepositAmount] = useState(0);
  const [nex10Balance, setNex10Balance] = useState(0);

  //context
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { hasMetamask, currentAccount, connectWallet } =
    useContext(MarketplaceContext);

  const amount = cart.cartItems.reduce((total, item) => {
    return total + item.price;
  }, 0);

  //user approves contract to access #UCD in wallet
  const handleDialogClose = () => {
    props.setShowPurchase(null);
  };

  //user to proceed with purchase
  const handleProceedDialogClose = () => {
    setProceedPurchase(false);
  };

  //approve transfer
  async function setApproval() {
    const ucdContract = new ethers.Contract(
      ucdContractAddress,
      ucdContractABI,
      signer
    );
    setDialogStatus(DIALOG_STATUS.LOADING);
    await ucdContract
      .approve(
        escrowContractAddress,
        ethers.utils.parseEther(amount.toString())
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
        setDialogStatus(DIALOG_STATUS.NONE);
        enqueueSnackbar(getError(err), { variant: 'error' });
      });
  }

  const checkAllowance = async () => {
    const user = currentAccount.toLowerCase();
    const nex10balance = await axios.get(
      `/api/wallet/${user}/${ucdContractAddress}`
    );
    await setNex10Balance(nex10balance.data.balance);

    if (nex10balance.data.balance >= amount) {
      setDialogStatus(DIALOG_STATUS.FUNDADDED);
      return;
    }

    const ucdContract = new ethers.Contract(
      ucdContractAddress,
      ucdContractABI,
      signer
    );
    setDialogStatus(DIALOG_STATUS.LOADING);
    setDepositAmount(amount);
    await ucdContract
      .allowance(currentAccount, escrowContractAddress)
      .then(async (val) => {
        const allowance = parseFloat(ethers.utils.formatEther(val));
        if (allowance >= amount) {
          setDialogStatus(DIALOG_STATUS.CONFIRMPURCHASE);
        } else {
          setDialogStatus(DIALOG_STATUS.APPROVE);
        }
      })
      .catch((err) => {
        setDialogStatus(DIALOG_STATUS.NONE);
        enqueueSnackbar(getError(err), { variant: 'error' });
      });
  };

  const depositFund = async () => {
    const escrowContract = new ethers.Contract(
      escrowContractAddress,
      escrowContractABI,
      signer
    );
    setDialogStatus(DIALOG_STATUS.LOADING);
    await escrowContract
      .burnToken(ucdContractAddress, ethers.utils.parseEther(amount.toString()))
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

  //open payment form
  const handlePayment = () => {
    setDialogStatus(DIALOG_STATUS.FILLDETAIL);
  };

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      checkAllowance();
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

      {dialogStatus === DIALOG_STATUS.APPROVED && (
        <>
          <DialogText>Approved successfully!</DialogText>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              disableRipple
              onClick={() => setDialogStatus(DIALOG_STATUS.CONFIRMPURCHASE)}
              sx={classes.dialogApprovalButton}
            >
              Continue
            </Button>
          </DialogActions>
        </>
      )}

      {dialogStatus === DIALOG_STATUS.CONFIRMPURCHASE && (
        <>
          <DialogText>Ready to proceed with your purchase(s)?</DialogText>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              onClick={() => setDialogStatus(DIALOG_STATUS.DEPOSITFUND)}
              sx={classes.dialogApprovalButton}
            >
              Absolutely, Yes!
            </Button>

            <DialogButton onClick={handleDialogClose}>
              No, Let Me Think Again{' '}
            </DialogButton>
          </DialogActions>
        </>
      )}

      {dialogStatus === DIALOG_STATUS.DEPOSITFUND && (
        <>
          <DialogText>Deposit fund to your NEX wallet.</DialogText>

          <DialogField>
            <span>Approved amount</span>
            <span>{amount} UCD</span>
          </DialogField>

          <DialogField>
            <span>Your NEX wallet</span>
            <span>{`${nex10Balance} UCD`}</span>
          </DialogField>

          <DialogText>Amount to add</DialogText>
          <DialogField>
            <DialogIconBox>
              {depositAmount > 0 && (
                <RemoveIcon
                  style={{
                    fontSize: 22,
                    cursor: 'pointer',
                    color: 'white',
                  }}
                  onClick={() => setDepositAmount(depositAmount - 1)}
                />
              )}
            </DialogIconBox>
            <span>{depositAmount} UCD</span>
            <DialogIconBox>
              {depositAmount < amount && (
                <AddIcon
                  style={{
                    fontSize: 22,
                    cursor: 'pointer',
                    color: 'white',
                  }}
                  onClick={() => setDepositAmount(depositAmount + 1)}
                />
              )}
            </DialogIconBox>
          </DialogField>

          <DialogActions sx={classes.approveContract}>
            <Button
              autoFocus
              onClick={deposiFund}
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
              onClick={handlePayment}
              sx={classes.dialogApprovalButton}
            >
              Continue
            </Button>
          </DialogActions>
        </>
      )}
      {dialogStatus === DIALOG_STATUS.FILLDETAIL && (
        <>
          <PaymentForm
            dialogStatus={dialogStatus}
            setDialogStatus={setDialogStatus}
          />
        </>
      )}
    </Dialog>
  );
}

export default PurchaseDialog;
