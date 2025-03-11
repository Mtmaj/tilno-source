import express from "express";
import { pspro } from "./shops/pspro";
import { techsiro } from "./shops/techsiro";

export const route = express();

route.use("/pspro", pspro);

route.use("/techsiro", techsiro);
