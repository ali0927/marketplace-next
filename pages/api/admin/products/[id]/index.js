import nc from 'next-connect';
import Product from '../../../../../models/Product.model';
import Admin from '../../../../../models/Admin.model';
import db from '../../../../../utils/db';
import { ethers } from 'ethers';
import { onError } from '../../../../../utils/error';

const handler = nc({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

//admin to update product
handler.put(async (req, res) => {
  await db.connect();
  const {
    name,
    slug,
    type,
    brand,
    currency,
    image,
    price,
    originalCount,
    countInStock,
    ethAddress,
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
    Product: [
      { name: 'name', type: 'string' },
      { name: 'slug', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'brand', type: 'string' },
      { name: 'currency', type: 'string' },
      { name: 'image', type: 'string' },
      { name: 'originalCount', type: 'uint256' },
      { name: 'countInStock', type: 'uint256' },
    ],
  };

  try {
    signingAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      {
        name: name,
        slug: slug,
        type: type,
        brand: brand,
        currency: currency,
        image: image,
        price: price,
        originalCount: originalCount,
        countInStock: countInStock,
      },
      signature
    );
  } catch (error) {
    console.log(error);
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

  let isAdmin;
  // Check if user is an admin
  try {
    isAdmin = await Admin.findOne({ address: wallet });
  } catch (err) {
    console.log('🚀 | handler.delete | err', err);
  }
  if (isAdmin) {
    res.send({ message: 'Admin verified' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'You are not a verified admin' });
  }

  //update product
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.type = req.body.type;
    product.brand = req.body.brand;
    product.currency = req.body.currency;
    product.image = req.body.image;
    product.price = req.body.price;
    product.originalCount = req.body.originalCount;
    product.countInStock = req.body.countInStock;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

//admin to delete product
handler.delete(async (req, res) => {
  await db.connect();

  const { productId, ethAddress, signature } = req.body;

  // Verify if address has correct format
  let wallet;
  let signingAddress;
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
    Product: [{ name: 'productId', type: 'string' }],
  };

  try {
    signingAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      {
        productId: productId,
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

  let isAdmin;
  // Check if user is an admin
  try {
    isAdmin = await Admin.findOne({ address: wallet });
  } catch (err) {
    console.log('🚀 | handler.delete | err', err);
  }
  if (isAdmin) {
    res.send({ message: 'Admin verified' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'You are not a verified admin' });
  }

  //Delete product
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default handler;
