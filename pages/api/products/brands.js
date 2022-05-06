import nc from "next-connect";
import Product from "../../../models/Product";
import db from "../../../utils/db";

const handler = nc();
//users to filter brands
handler.get(async (req, res) => {
  await db.connect();
  const brands = await Product.find().distinct("brand");
  await db.disconnect();
  res.send(brands);
});

export default handler;
