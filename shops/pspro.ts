import express, { response } from "express";
import cheerio from "cheerio";
import { response_sample } from "./temp_response";
import { ProductDB } from "../db/Product";
export const pspro = express();
function categoryListPspro(
  categoryData: any[],
  list: { title: string; value: string }[],
  parentString: string
) {
  categoryData.map((category) => {
    if ((category.items ?? []).length > 0) {
      categoryListPspro(
        category.items,
        list,
        parentString + (parentString != "" ? " < " : "") + category.title
      );
    } else {
      list.push({
        title: parentString + " < " + category.title,
        value: category.link.split("/")[category.link.split("/").length - 1],
      });
    }
  });
  return list;
}
pspro.get("/categories", async (req, res) => {
  try {
    // دریافت HTML از سایت هدف
    const html = await fetch("https://pspro.ir").then((response) =>
      response.text()
    );
    const { load } = await import("cheerio");
    // لود HTML در cheerio
    const $ = load(html);

    // تابع استخراج منو
    const extractMenu = () => {
      const categories: any[] = [];

      $("#main-menu > li.items").each((i, mainLi) => {
        const category = {
          title: $(mainLi).find("a").first().text().trim(),
          link: $(mainLi).find("a").first().attr("href"),
          items: [],
        };

        $(mainLi)
          .find(".sub-menu ul")
          .each((j, subUl) => {
            let currentHeader: any = null;

            $(subUl)
              .find("li")
              .each((k, subLi) => {
                if ($(subLi).hasClass("sub-items-header")) {
                  currentHeader = {
                    title: $(subLi).find("a").text().trim(),
                    link: $(subLi).find("a").attr("href"),
                    items: [],
                  };
                  category.items.push(currentHeader as never);
                } else if ($(subLi).hasClass("sub-items") && currentHeader) {
                  currentHeader.items.push({
                    title: $(subLi).find("a").text().trim(),
                    link: $(subLi).find("a").attr("href"),
                  });
                }
              });
          });

        categories.push(category);
      });
      return categories;
    };
    categoryListPspro(extractMenu(), [], "");

    res.json({
      success: true,
      data: categoryListPspro(extractMenu(), [], ""),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

pspro.get("/products", async (req, res) => {
  const { query } = req;
  const { category, limit } = query as { category?: string; limit?: number };
  if (category && limit) {
    const response_html = await fetch(
      `${process.env.PSPRO_CATEGORY_URL}/${category}?limit=${limit}`
    )
      .then(async (response) => {
        return await response.text();
      })
      .then((response_text) => response_text);
    if (!response_html) {
      res.status(500).send("Could not fetch page");
    }
    const { load } = await import("cheerio");
    const $ = load(response_html);
    const products_list = [] as {
      title: string;
      short_description: string;
      price: number;
      a_href?: string;
    }[];
    const products_res = [] as {
      title: string;
      short_description: string;
      price: number;
      a_href?: string;
      type: string;
      creator: string;
      images: string[];
      details: string[];
      information: Record<string, any>;
    }[];
    $(".product").each((_, el) => {
      const title = $(el).find("h6.font-weight-bold").text().trim();
      const short_description = $(el).find("h6.text-secondary").text().trim();
      const price = parseInt(
        $(el)
          .find("button.btn")
          .text()
          .trim()
          .replace("تومان", "")
          .toString()
          .replace(/,/g, "")
      );
      const a_href = $(el).find("a").attr("href");

      products_list.push({ title, short_description, price, a_href });
    });
    for (let i = 0; i < products_list.length; i++) {
      const response_html = await fetch(`${products_list[i].a_href}`)
        .then(async (response) => {
          return await response.text();
        })
        .then((response_text) => response_text);

      const product_detail = load(response_html);
      const creator = product_detail(
        "#content > div.bg-white.row.no-gutters.rounded-2x.shadow.p-5 > div.col-6.d-flex.flex-column.justify-content-between.px-4 > div.my-2 > div > a > h5"
      )
        .text()
        .trim();
      const type = product_detail("h5.d-inline:first").text().trim();
      let images: string[] = [];
      let details: string[] = [];
      images.push(
        product_detail(
          "#content > div.bg-white.row.no-gutters.rounded-2x.shadow.p-5 > div:nth-child(1) > div.position-relative.overflow-hidden.img-zoom-hover > img"
        ).attr("src")!
      );
      product_detail("#photo-gallery > div > div.row > div.col-5")
        .find("img")
        .each((_, el) => {
          if (product_detail(el).attr("src") != undefined) {
            images.push(product_detail(el).attr("src")?.trim()!);
          }
        });
      product_detail(
        "#content > div.bg-white.row.no-gutters.rounded-2x.shadow.p-5 > div.col-6.d-flex.flex-column.justify-content-between.px-4 > div:nth-child(6)"
      )
        .find("h5")
        .each((_, el) => {
          details.push(product_detail(el).text().trim());
        });
      let information: Record<string, any> = {};

      product_detail("#tab-specification > div")
        .find("span")
        .each((_, el) => {
          if (product_detail(el).hasClass("col-12")) {
            information[product_detail(el).text().trim()] = {} as Record<
              string,
              any
            >;
            product_detail("#tab-specification > div")
              .find("span")
              .each((_, ele) => {
                if (product_detail(ele).hasClass("col-3")) {
                  information[product_detail(el).text().trim()][
                    product_detail(ele).text().trim()
                  ] = null;
                } else if (product_detail(ele).hasClass("col-9")) {
                  Object.entries(
                    information[product_detail(el).text().trim()]
                  ).map((item, i) => {
                    if (item[1] == null) {
                      information[product_detail(el).text().trim()][item[0]] =
                        product_detail(ele).text().trim();
                    }
                  });
                }
              });
          }
        });

      products_res.push({
        title: products_list[i].title,
        short_description: products_list[i].short_description,
        price: products_list[i].price,
        a_href: products_list[i].a_href,
        type: type,
        images,
        details: information["مشخصات کلی"]
          ? Object.entries(information["مشخصات کلی"]).map(
              ([key, value], i) => key + " : " + value
            )
          : details,
        creator,
        information,
      });
    }
    res.json(products_res);
  } else {
    res.send({ error: "Invalid query parameters" }).status(400);
  }
});

pspro.get("/product/:id", async (req, res) => {
  const { id } = req.params as { id: string };

  const product = await ProductDB.findOne({ product_id: id });

  const text = await fetch(product?.a_href ?? "").then((response) =>
    response.text()
  );

  const { load } = await import("cheerio");
  const $ = load(text);

  const price = parseInt(
    $("#button-cart")
      .text()
      .trim()
      .replace("تومان", "")
      .toString()
      .replace(/,/g, "")
  );
  res.json({ price: price });
});
