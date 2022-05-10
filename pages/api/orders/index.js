// import nc from "next-connect";
// import Order from "../../../models/Order.model";
// import db from "../../../utils/db";
// import { onError } from "../../../utils/error";

// const handler = nc({
//   onError,
// });

// handler.post(async (req, res) => {
//   await db.connect();
//   const newOrder = new Order({
//     ...req.body,
//   });
//   const order = await newOrder.save();
//   res.statusCode(201).send(order);
// });

// export default handler;

const { ethers } = require("ethers");
import nc from "next-connect";
import { onError } from "../../../utils/error";
import Order from "../../../models/Order.model";
import Product from "../../../models/Product.model";
import db from "../../../utils/db";

const handler = nc({
  onError,
});

handler.post(async (req, res) => {
  await db.connect();
  const {
    email,
    discordId,
    ethAddress,
    shippingAddress,
    cartItems,
    signature,
  } = req.body;

  // Verify if address has correct format
  let wallet;
  let signingAddress;
  try {
    wallet = ethers.utils.getAddress(ethAddress);
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: "Invalid Address",
    });
  }

  // Initialize Domain
  const domain = {
    name: "Nex10 Marketplace",
    version: "1",
    chainId: process.env.NODE_ENV === "prod" ? 1 : 4,
  };

  // The named list of all type definitions
  const types = {
    Purchase: [
      { name: "email", type: "string" },
      { name: "discordId", type: "string" },
      { name: "shippingAddress", type: "string" },
      { name: "cartItems", type: "string[]" },
    ],
  };

  try {
    signingAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      {
        email: email,
        discordId: discordId,
        shippingAddress: shippingAddress,
        cartItems: cartItems,
      },
      signature
    );
  } catch (error) {
    console.log(signature);
    console.log("Signing fail");
    return res.status(400).json({
      success: false,
      data: error,
    });
  }

  // Check if signer is correct
  if (
    String(signingAddress).toLocaleLowerCase() !==
    String(ethAddress).toLowerCase()
  ) {
    return res.status(400).json({
      success: false,
      data: "Invalid Signature",
    });
  }

  // Add purchase to database
  try {
    // Iterate Cart and update database

    for (let item of cartItems) {
      // Get Name & Price from Product Model
      let product = await Product.findOne({ _id: item });
      await Order.create({
        name: product.name,
        quantity: 1,
        price: product.price,
        discordId: discordId,
        ethAddress: ethAddress,
        shippingAddress: shippingAddress,
        email: email,
        paidAt: Date.now(),
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "Your purchase has been made",
        result: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
  await db.disconnect();
});
export default handler;
