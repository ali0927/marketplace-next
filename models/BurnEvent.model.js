const mongoose = require('mongoose');
const burnEventSchema = new mongoose.Schema(
  {
    nonce: { type: Number, required: true },
    chainId: { type: Number, required: true },
    user: { type: String, required: true },
    token: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const BurnEvent =
  mongoose.models.BurnEvent || mongoose.model('BurnEvent', burnEventSchema);
module.exports = BurnEvent;
