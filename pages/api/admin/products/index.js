import nc from 'next-connect';
import Product from '../../../../models/Product.model';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});

//users to access products
handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

//admin to add new products
handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'sample name',
    slug: 'type-brand-' + Math.random(),
    type: 'Raffle/Whitelist',
    brand: 'e.g. Uninterested Unicorns',
    currency: 'UCD/SHO',
    image: '/images/shirt1.jpg',
    price: 0,
    originalCount: 0,
    countInStock: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;
