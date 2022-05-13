
const mongoose = require("mongoose");


const walletSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true },
    balances: [
      {
        token_address: { type: String, required: true },
        token_name: { type: String, required: true },
        token_symbol: { type: String, required: true },
        balance: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
