import { createContext, useState, useEffect } from "react";
//blockchain
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
//environment
import { environmentTest } from "../lib/environments/environment";
import { environment } from "../lib/environments/environment.prod";
//contract
import ucdContract from "../lib/contracts/UniCandy.json";
import shoContract from "../lib/contracts/MockSho.json";

let signer, provider;
let CHAIN_ID = environment.chainId; // Ethereum
let CHAIN_ID_TEST = environmentTest.chainId; // Rinkeby

//variables
const ucdContractAddress = ucdContract.address[environmentTest.chainId]; //to update
const ucdContractABI = ucdContract.abi;
const shoContractAddress = shoContract.address; //to update (rinkeby)
const shoContractABI = shoContract.abi;

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [isOnMainnet, setIsOnMainnet] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [ucdWalletBalance, setUcdWalletBalance] = useState("");
  const [shoWalletBalance, setShoWalletBalance] = useState("");

  //check if metamask wallet is connected
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
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
    checkChain();
    getAccount();
    getUCDBalance();
    getSHOBalance();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
        checkChain();
        getAccount();
        getUCDBalance();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
        checkChain();
        getAccount();
        getUCDBalance();
      });
    }
  }, [currentAccount, ucdWalletBalance, shoWalletBalance]);

  const connectWallet = async () => {
    if (!window.ethereum) return;
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
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
      method: "eth_accounts",
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
        if (CHAIN_ID_TEST === chainId) {
          //to update
          setIsOnMainnet(true);
        } else {
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
  async function createShoContract() {
    return new ethers.Contract(shoContractAddress, shoContractABI, signer);
  }

  /**
   * Get UCD balance for wallet address
   */
  async function getUCDBalance() {
    await getAccount();
    if (currentAccount) {
      const contract = await createUcdContract();

      let balance = await contract.balanceOf(currentAccount);
      setUcdWalletBalance(
        parseFloat(ethers.utils.formatEther(balance)).toFixed(0)
      );
    }
  }

  /**
   * Get SHO balance for wallet address
   */
  async function getSHOBalance() {
    await getAccount();
    if (currentAccount) {
      const contract = await createShoContract();

      let balance = await contract.balanceOf(currentAccount);
      setShoWalletBalance(
        parseFloat(ethers.utils.formatEther(balance)).toFixed(0)
      );
    }
  }

  return (
    <MarketplaceContext.Provider
      value={{
        hasMetamask,
        currentAccount,
        connectWallet,
        checkChain,
        getUCDBalance,
        getSHOBalance,
        isOnMainnet,
        ucdWalletBalance,
        shoWalletBalance,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
