import nc from "next-connect";
import Product from "../../../models/Product.model";
import db from "../../../utils/db";

const handler = nc();
//users to get individual products
handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
