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

export default handler;
