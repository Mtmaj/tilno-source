import express from "express";
import { route } from "./route";
import dotenv from "dotenv";

const app = express();
dotenv.config({ path: ".env.development" });

app.use(express.json());
app.use("/api", route);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
