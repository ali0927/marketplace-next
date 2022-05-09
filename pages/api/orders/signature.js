require("dotenv").config();
// const Auction = require("../models/Auction.model");
// const Bidders = require("../models/Bidders.model");
const { ethers, BigNumber } = require("ethers");
import ucdContract from "../../../lib/contracts/UniCandy.json";

import nc from "next-connect";
import Order from "../../../models/Order";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";

const handler = nc({
  onError,
});

handler.post(async (req, res) => {
  await db.connect();
  const newOrder = new Order({
    ...req.body,
  });
  const order = await newOrder.save();
  res.statusCode(201).send(order);
});

handler.post(async (req, res, next) => {
  const { address, signature, amount, auctionId, discordId } = req.body;
  console.log("🚀 | exports.bidToAuction= | amount", amount);

  // Verify if address has correct format
  let wallet;
  let signingAddress;
  try {
    wallet = ethers.utils.getAddress(address);
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: "Invalid Address",
    });
  }

  // Initialize Domain
  const domain = {
    name: "Uninterested Unicorns",
    version: "1",
    chainId: process.NODE_ENV === "prod" ? 1 : 4,
  };

  // The named list of all type definitions
  const types = {
    Bid: [
      { name: "bid_amount", type: "string" },
      { name: "discordId", type: "string" },
    ],
  };

  // Verify if user has enough UCD
  let ucdBalance = await UniCandyContract.balanceOf(wallet);

  // Determine if user has enough UCD in wallet to place the bid
  if (ucdBalance.lt(ethers.utils.parseEther(amount))) {
    return res.status(200).json({
      success: false,
      data: {
        message: "User does not have enough UCD",
        result: false,
      },
    });
  }

  try {
    signingAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      { bid_amount: amount, discordId: discordId },
      signature
    );
  } catch (error) {
    console.log("Signing fail");
    return res.status(400).json({
      success: false,
      data: error,
    });
  }

  // Check if signer is correct
  if (
    String(signingAddress).toLocaleLowerCase() !== String(address).toLowerCase()
  ) {
    return res.status(400).json({
      success: false,
      data: "Invalid Signature",
    });
  }

  // Check if auction has started and not ended
  try {
    let data;

    // Update Auction with highest bid
    data.currentBid = String(amount);
    data.currentWinner = address;
    await data.save();

    // Update Bidders
    await Bidders.create({
      auctionId: auctionId,
      address: address,
      bid: amount,
      discordId: discordId,
    });

    return res.status(200).json({
      success: true,
      data: {
        message: "Your bid has been placed",
        result: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});
export default handler;
