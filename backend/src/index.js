import express from "express";
import cors from "cors";
import { PORT, FRONTEND_URL } from "./config.js"; // Importa ambos
import itemRoutes from "./routes/items.routes.js";
import anvil_contentsRoutes from "./routes/anvil_contents.routes.js";
import movementsRoutes from "./routes/movements.routes.js";

const app = express();

app.use(cors({
  origin: FRONTEND_URL
}));

app.use(express.json());

app.use(itemRoutes);
app.use(anvil_contentsRoutes);
app.use(movementsRoutes);

app.listen(PORT, () => {
  console.log("Server on port", PORT);
});