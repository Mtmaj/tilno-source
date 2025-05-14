import express from "express";
import { pspro } from "./shops/pspro";
import { techsiro } from "./shops/techsiro";
import { ProductDB } from "./db/Product";

export const route = express();

route.use("/pspro", pspro);

route.use("/techsiro", techsiro);

route.post("/product-db", async (req, res) => {
  const { categories_slug, website } = req.body as {
    categories_slug: string;
    website: string;
  };
  console.log(eval(decodeURI(categories_slug)))
  const products = await ProductDB.find({
    category_slug: eval(decodeURI(categories_slug)),
    website: eval(decodeURI(website)),
  });
  res.json(products);
});

route.use((req, res, next) => {
  console.log(req.url);
  next();
});
