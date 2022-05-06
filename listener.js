const ethers = require("ethers")
const mongoose = require("mongoose")
const EscrowWallet = require("./lib/contracts/EscrowWallet.json")
const MockSho = require("./lib/contracts/MockSho.json")

require("dotenv").config()

const rinkebyProvider = new ethers.providers.JsonRpcProvider(process.env.INFURA_PROVIDER_RINKEBY)

const EscrowWalletContract = new ethers.Contract(
  EscrowWallet.address,
  EscrowWallet.abi,
  rinkebyProvider
);

const walletSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true },
    balances: [{
        token_address: { type: String, required: true, unique: true },
        token_name: { type: String, required: true },
        token_symbol: { type: String, required: true },
        balance: { type: Number, required: true }
      }]
  },
  {
    timestamps: true,
  }
);
const Wallet = mongoose.model("Wallet", walletSchema)

const nonceArr = []
let nonce

EscrowWalletContract.on('BurnToken', async (user, token, amount_bn, nonce_bn, event) => {
  nonce = nonce_bn.toNumber()
  if (nonceArr[nonce]) { 
    return
  }
  nonceArr[nonce] = true

  console.log('BurnToken---', user, token, amount_bn)
  const address = ethers.utils.getAddress(user)
  const tokenAddress = ethers.utils.getAddress(token)
  const amount = parseFloat(ethers.utils.formatEther(amount_bn))

  try {
    const TokenContract = new ethers.Contract(tokenAddress, MockSho.abi, rinkebyProvider)
    const tokenSymbol = await TokenContract.symbol()
    const tokenName = await TokenContract.name()

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let data;
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
            token_id: 1,
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
