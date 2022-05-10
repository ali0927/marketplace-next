const ethers = require("ethers")
const mongoose = require("mongoose")
const EscrowWallet = require("../lib/contracts/EscrowWallet.json")
const MockSho = require("../lib/contracts/MockSho.json")
const Wallet = require("../models/Wallet.model")
const BurnEvent = require("../models/BurnEvent.model")

require("dotenv").config()

const ethProvider = new ethers.providers.JsonRpcProvider(process.env.RPC_ETHEREUM)

const EscrowWalletContract = new ethers.Contract(
  EscrowWallet.address[process.env.CHAINID_ETH],
  EscrowWallet.abi,
  ethProvider
);

EscrowWalletContract.on('BurnToken', async (user, token, amount_bn, nonce_bn, event) => {
  console.log('Eth BurnToken---', user, token, amount_bn)
  try {
    const nonce = nonce_bn.toNumber()  
    const address = ethers.utils.getAddress(user)
    const tokenAddress = ethers.utils.getAddress(token)
    const amount = parseFloat(ethers.utils.formatEther(amount_bn))

    const TokenContract = new ethers.Contract(tokenAddress, MockSho.abi, ethProvider)
    const tokenSymbol = await TokenContract.symbol()
    const tokenName = await TokenContract.name()

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let burnEvent
    burnEvent = await BurnEvent.findOne({
      nonce: nonce,
      chainId: process.env.CHAINID_ETH
    })

    if (burnEvent) {
      return
    }
    else {
      burnEvent = await BurnEvent.create({
        nonce: nonce,
        chainId: process.env.CHAINID_ETH,
        user: address, 
        token: tokenAddress, 
        amount: amount
      })
    }
    
    let data
    data = await Wallet.findOne({ address: address })
   
    if (data) {
      const tokenIdx = data.balances.findIndex(item => item.token_address === tokenAddress)
      if (tokenIdx != -1) {
        data.balances[tokenIdx].balance += amount
      }
      else {
        data.balances.push({
            token_address: tokenAddress,
            token_name: tokenName,
            token_symbol: tokenSymbol,
            balance: amount
        })
      }
      data = await Wallet.findOneAndUpdate(
        { _id: data._id },
        data,
        { new: true }
      )
    }
    else {
       data = await Wallet.create({
        address: address, 
        balances: [
          {
            token_address: tokenAddress,
            token_name: tokenName,
            token_symbol: tokenSymbol,
            balance: amount
          }
        ]
      });
    }

    await mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
})
