import express, { response } from "express";
import { Daum, Product, TechsiroProduct } from "../types";
export const techsiro = express();
techsiro.get("/products", async (req, res) => {
  const { query } = req;
  const { category } = query as { category?: string; limit?: number };
  if (category) {
    let product_list: Daum[] = [];
    let is_fetch = true;
    let page = 1;
    while (is_fetch) {
      const products_fetch = await fetch(
        `${process.env.TECHSIRO_PRODUCT_URL}/${category}?page=${page}&exists=false`
      )
        .then(async (response) => await response.json())
        .then((resp) => resp as TechsiroProduct);
      product_list = [...product_list, ...products_fetch.products.data];
      is_fetch = products_fetch.pagination_data.hasMorePages;
      console.log(`Fetched page ${page}`);
      page++;
    }
    console.log(product_list.length);
    res.json(product_list);
  } else {
    res.send({ error: "Invalid query parameters" }).status(400);
  }
});
