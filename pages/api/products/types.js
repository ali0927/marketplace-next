import nc from "next-connect";
import Product from "../../../models/Product.model";
import db from "../../../utils/db";

const handler = nc();
//users to filter types
handler.get(async (req, res) => {
  await db.connect();
  const types = await Product.find().distinct("type");
  await db.disconnect();
  res.send(types);
});

export default handler;
