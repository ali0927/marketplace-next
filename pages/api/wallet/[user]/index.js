import Wallet from '../../../../models/Wallet.model';
import db from '../../../../utils/db';
import nc from 'next-connect';

const handler = nc();
//users to get all products
handler.get(async (req, res) => {
  await db.connect();
  try {
    // const wallet = await Wallet.findOne({
    //   address: req.query.user,
    // });
    const wallet = await Wallet.findOneAndUpdate({
      address: req.query.user,
      returnDocument: 'after',
    });
    await db.disconnect();
    res.send(wallet);
  } catch {
    res.send({});
  }
});

export default handler;
