import nc from 'next-connect';
import Order from '../../../models/Order.model';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ ethAddress: req.query.currentAccount });
  res.send(orders);
});

export default handler;
