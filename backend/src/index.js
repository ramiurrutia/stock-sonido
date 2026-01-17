import express from "express";
import { PORT } from "./config.js";
import itemRoutes from "./routes/items.routes.js";
import anvil_contentsRoutes from "./routes/anvil_contents.routes.js"
import cors from "cors";

const app = express();

app.use(
  cors()
);

app.use(express.json());

app.use(itemRoutes);
app.use(anvil_contentsRoutes)

app.listen(PORT);
console.log("Server on port", PORT);
