import Wallet from '../../../../models/Wallet.model';
import db from '../../../../utils/db';
import nc from 'next-connect';

const handler = nc();
//users to get all products
handler.get(async (req, res) => {
  await db.connect();
  const wallet = await Wallet.findOne({
    address: req.query.user,
  });
  await db.disconnect();
  res.send(wallet);
});

export default handler;
