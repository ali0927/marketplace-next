import nc from "next-connect";
import Product from "../../../models/Product";
import db from "../../../utils/db";

const handler = nc();

//admin to add new products
handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample name",
    slug: "sample-url-link",
    type: "physical/virtual",
    brand: "UU/SHO",
    currency: "UCD/SHO",
    image: "/images/shirt1.jpg",
    price: 0,
    countInStock: 0,
    description: "sample description",
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created", product });
});

export default handler;
