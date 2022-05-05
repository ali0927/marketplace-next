import nc from "next-connect";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import { onError } from "../../../../utils/error";

const handler = nc({
  onError,
});

//users to access individual products
handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

//admin to add new products
handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample name",
    slug: "sample-url-" + Math.random(),
    type: "physical/virtual",
    brand: "Uninterested Unicorns/Shogun Samurai",
    currency: "UCD/SHO",
    image: "/images/shirt1.jpg",
    featuredImage: "/images/shirt1.jpg",
    isFeatured: "yes",
    price: 0,
    countInStock: 0,
    description: "sample description",
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created", product });
});

export default handler;
