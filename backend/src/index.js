import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config.js";
import itemRoutes from "./routes/items.routes.js";
import anvil_contentsRoutes from "./routes/anvil_contents.routes.js";
import movementsRoutes from "./routes/movements.routes.js";
import { pool } from "./db.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(itemRoutes);
app.use(anvil_contentsRoutes);
app.use(movementsRoutes);

app.listen(PORT, () => {
  pool.query("SELECT 1")
  .then(() => console.log("Postgres conectado"))
  .catch(err => console.error("Error DB:", err));
  console.log("Server on port", PORT);
  console.log("Assets served at: http://localhost:" + PORT + "/assets");
});