import nc from "next-connect";
import Product from "../../../models/Product.model";
import db from "../../../utils/db";

const handler = nc();
//users to get all products
handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
