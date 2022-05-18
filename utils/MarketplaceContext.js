import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { environmentTest } from '../lib/environments/environment';
import { environment } from '../lib/environments/environment.prod';
import ucdContract from '../lib/contracts/UniCandy.json';
import { Store } from './Store';
// import shoContract from "../lib/contracts/MockSho.json";

let signer, provider;

const ucdContractAddress =
  process.env.NODE_ENV === 'prod'
    ? ucdContract.address[environment.chainId]
    : ucdContract.address[environmentTest.chainId];
const ucdContractABI = ucdContract.abi;
// const shoContractAddress =
//   process.env.NODE_ENV === "prod"
//     ? shoContract.address[environment.chainId_polygon]
//     : shoContract.address[environmentTest.chainId_polygon];
// const shoContractABI = shoContract.abi;

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [isOnMainnet, setIsOnMainnet] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [nex10Balance, setNex10Balance] = useState(0);
  const [ucdWalletBalance, setUcdWalletBalance] = useState('');
  // const [shoWalletBalance, setShoWalletBalance] = useState("");

  //check if metamask wallet is connected
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setHasMetamask(true);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
    }
    checkChain();
    getAccount();
    getNex10Balance();
    getUCDBalance();
    getNex10Balance();
    // getSHOBalance();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
        checkChain();
        getAccount();
        getUCDBalance();
        getNex10Balance();
      });
      window.ethereum.on('accountsChanged', () => {
        // window.location.reload();
        checkChain();
        getAccount();
        getUCDBalance();
        getNex10Balance();
      });
    }
  }, [
    currentAccount,
    ucdWalletBalance,
    nex10Balance,
    // shoWalletBalance
  ]);

  const connectWallet = async () => {
    if (!window.ethereum) return;
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function getAccount() {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    setCurrentAccount(accounts[0]);
  }

  /**
   * Check chain
   */
  const checkChain = async () => {
    if (!window.ethereum) return;
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      try {
        const { chainId } = await provider.getNetwork();
        //to update
        if (chainId === 1) {
          setIsOnMainnet(true);
        }
        if (chainId === 4) {
          setIsOnMainnet(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  /**
   * Function to create a contract based on address, abi, and signer
   */
  async function createUcdContract() {
    return new ethers.Contract(ucdContractAddress, ucdContractABI, signer);
  }
  // async function createShoContract() {
  //   return new ethers.Contract(shoContractAddress, shoContractABI, signer);
  // }

  /**
   * Get UCD balance for wallet address
   */
  async function getUCDBalance() {
    await getAccount();
    if (currentAccount) {
      const contract = await createUcdContract();
      let balance = await contract.balanceOf(currentAccount);

      setUcdWalletBalance(
        parseFloat(ethers.utils.formatEther(balance))
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      );
    }
  }

  /**
   * Get SHO balance for wallet address
   */
  // async function getSHOBalance() {
  //   await getAccount();
  //   if (currentAccount) {
  //     const contract = await createShoContract();

  //     let balance = await contract.balanceOf(currentAccount);
  //     setShoWalletBalance(
  //       parseFloat(ethers.utils.formatEther(balance)).toFixed(0)
  //     );
  //   }
  // }
  /**
   * Get Nex10 balance for wallet address
   */
  const getNex10Balance = async () => {
    await getAccount();
    if (currentAccount) {
      const user = currentAccount.toLowerCase();
      const nex10balance = await axios.get(
        `/api/wallet/${user}/${ucdContractAddress.toLowerCase()}`
      );
      await setNex10Balance(nex10balance.data.balance);
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        hasMetamask,
        currentAccount,
        nex10Balance,
        isOnMainnet,
        ucdWalletBalance,
        // shoWalletBalance,
        connectWallet,
        checkChain,
        getUCDBalance,
        // getSHOBalance,
        getNex10Balance,
        setNex10Balance,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
