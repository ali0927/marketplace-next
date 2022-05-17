import Order from '../../../models/Order.model';
import Product from '../../../models/Product.model';
import Wallet from '../../../models/Wallet.model';
import db from '../../../utils/db';
import { ethers } from 'ethers';
import nc from 'next-connect';
import { onError } from '../../../utils/error';
import { environmentTest } from '../../../lib/environments/environment';
import { environment } from '../../../lib/environments/environment.prod';
import ucdContract from '../../../lib/contracts/UniCandy.json';

const ucdContractAddress =
  process.env.NODE_ENV === 'prod'
    ? ucdContract.address[environment.chainId].toLowerCase()
    : ucdContract.address[environmentTest.chainId].toLowerCase();
const ucdContractABI = ucdContract.abi;

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
  let walletBalance;
  let product;
  try {
    wallet = ethers.utils.getAddress(ethAddress);
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: 'Invalid Address',
    });
  }

  // Initialize Domain
  const domain = {
    name: 'Nex10 Marketplace',
    version: '1',
    chainId: process.env.NODE_ENV === 'prod' ? 1 : 4,
  };

  // The named list of all type definitions
  const types = {
    Purchase: [
      { name: 'email', type: 'string' },
      { name: 'discordId', type: 'string' },
      { name: 'shippingAddress', type: 'string' },
      { name: 'cartItems', type: 'string[]' },
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
      data: 'Invalid Signature',
    });
  }

  // Add purchase to database
  try {
    // Iterate Cart and update database
    for (let item of cartItems) {
      // Get Name & Price from Product Model
      product = await Product.findOne({ _id: item });

      await Order.create({
        name: product.name,
        brand: product.brand,
        image: product.image,
        quantity: 1,
        price: product.price,
        discordId: discordId,
        ethAddress: ethAddress,
        shippingAddress: shippingAddress,
        email: email,
        paidAt: Date.now(),
      });

      //Get wallet balance from Wallet Model
      walletBalance = await Wallet.findOne({
        address: req.body.ethAddress,
      });
      const tokenAddress = ucdContractAddress;
      const tokenIdx = walletBalance.balances.findIndex(
        (item) => item.token_address === tokenAddress
      );
      //decrease quantity by 1, decrease nex10 balance by price of product
      if (product.countInStock <= 0) {
        res.status(500).json({
          success: false,
          error: `Ordered ${product} is out of stock`,
        });
      } else {
        product.countInStock -= 1;
        await product.save();
        walletBalance.balances[tokenIdx].balance -= product.price;
        await walletBalance.save();
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        message: 'Your purchase has been made',
        result: true,
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
  await db.disconnect();
});
export default handler;
