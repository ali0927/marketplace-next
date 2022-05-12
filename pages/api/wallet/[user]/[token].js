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
  const token = await wallet.balances.find(
    (token) => token.token_address === req.query.token
  );
  await db.disconnect();
  res.send(token);
});

export default handler;
