import express from "express";
import { route } from "./route";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"

const app = express();
dotenv.config({ path: ".env.development" });
main().catch((err) => console.log(err));
app.use(cors())

app.use(express.json());
app.use("/api", route);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

async function main() {
  await mongoose.connect(
    "mongodb://root:v0D4FTRlxABC9KxvwtpR4IQz@eiger.liara.cloud:34897/my-app?authSource=admin"
  );
  console.log("database connect");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
