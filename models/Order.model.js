
const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discordId: { type: String, required: true },
    ethAddress: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    email: { type: String, required: true },
    // totalPrice: { type: Number, required: true },
    // isPaid: { type: Boolean, required: true, default: false },
    // isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    // deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
