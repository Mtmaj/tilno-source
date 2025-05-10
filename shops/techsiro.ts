import express, { response } from "express";
import {
  CategoryTechSiro,
  Daum,
  ProductResponse,
  TechsiroProduct,
} from "../types";
import cheerio from "cheerio";
import { ProductDB } from "../db/Product";
import { json } from "stream/consumers";
export const techsiro = express();
techsiro.get("/products", async (req, res) => {
  const { query } = req;
  const { category } = query as { category?: string; limit?: number };
  if (category) {
    let product_list: Daum[] = [];
    let product_list_formatted: ProductResponse[] = [];
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
      page++;
    }
    const { load } = await import("cheerio");
    for (let i = 0; i < product_list.length; i++) {
      let data_for_push: ProductResponse = {
        images: [],
        title: "",
        price: 0,
        details: [],
      };
      let product_in_list = product_list[i];
      const page_data_html = await fetch(product_in_list.show_product_url).then(
        (res) => res.text().then((res) => res)
      );
      const page_data_load = load(page_data_html);
      page_data_load(
        "#productImagesModal > div > div > div > div.images-gallery > div > div.col-7 > div"
      )
        .find("div")
        .each((_, el) => {
          page_data_load(el)
            .find("img")
            .each((_, el) => {
              if (data_for_push.images.includes(el.attribs.src) == false) {
                data_for_push.images = [
                  ...data_for_push.images,
                  el.attribs.src as string,
                ];
              }
            });
        });
      data_for_push.price = product_in_list.price;
      page_data_load(
        "body > main > div.product-page-wrapper > section.show-product > div > div > div.col-8.ps-0 > div > div.d-flex.justify-content-between.align-items-start.pt-2.w-100 > div.product-short-description > ul"
      )
        .find("span")
        .each((i, el) => {
          data_for_push.details = [
            ...data_for_push.details,
            page_data_load(el).text(),
          ];
        });
      data_for_push.a_href = product_in_list.show_product_url;
      data_for_push.title = product_in_list.title;
      product_list_formatted.push(data_for_push);
    }

    res.json(product_list_formatted);
  } else {
    res.send({ error: "Invalid query parameters" }).status(400);
  }
});

techsiro.get("/categories", async (req, res) => {
  try {
    // Fetch the HTML content of the website
    const response_html = await fetch("https://techsiro.com").then((response) =>
      response.text()
    );

    // Load the HTML into cheerio
    const { load } = await import("cheerio");
    const $ = load(response_html);

    // Find the script tag containing the JavaScript variable
    const scriptContent = $("body > script:nth-child(50)").html();

    if (scriptContent) {
      // Extract the JavaScript variable using regex
      const match = eval(
        "( " + scriptContent.replace("let navbar = new Vue", "") + " )"
      );

      // console.log(match);
      if (match) {
        // Parse the JSON-like array
        res.json({
          data: categoryListTechSiro(
            match.data.categoryData as CategoryTechSiro[],
            [],
            ""
          ),
        }); // Send the extracted data as a response
      } else {
        res.status(500).send("Could not extract categoryData");
      }
    } else {
      res.status(500).send("Script containing categoryData not found");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Failed to fetch categories");
  }
});

techsiro.get("/product/:id", async (req, res) => {
  const { id } = req.params as { id: string };

  const product = await ProductDB.findOne({ product_id: id });

  const text = await fetch(product?.a_href ?? "").then((response) =>
    response.text()
  );

  const { load } = await import("cheerio");
  const $ = load(text);
  const scriptContent = $($("script")[1]).text();

  res.json({ price: JSON.parse(scriptContent).offers.price });
});
techsiro.post("/set-product", async (req, res) => {
  console.log("OKKKK");
  const requestList = req.body as {
    a_href: string;
    product_id: number;
    website: string;
    category_slug: string;
  }[];

  const new_product = await ProductDB.insertMany(requestList);

  res.json(new_product);
});

function categoryListTechSiro(
  categoryData: CategoryTechSiro[],
  list: { title: string; value: string }[],
  parentString: string
) {
  // console.log(categoryData);
  categoryData.map((category) => {
    // console.log(category.hasChild);
    if (category.hasChild > 0) {
      categoryListTechSiro(
        category.parentCategories ?? category.childCategories ?? [],
        list,
        parentString + (parentString != "" ? " < " : "") + category.title
      );
    } else {
      list.push({
        title: parentString + " < " + category.title,
        value: category.url.split("/")[category.url.split("/").length - 1],
      });
    }
  });
  return list;
}
