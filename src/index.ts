import dotenv from "dotenv";
dotenv.config(); //load env variabls first

import cors from "cors";
import pool from "./db/config";
import express from "express";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import pdfRoutes from "./routes/pdf";
import poRoutes from "./routes/purchaseOrders";
import locationRoutes from "./routes/locations";
import deliveriesRoute from "./routes/deliveries";
import cookieparser from "cookie-parser";
import { validateMe } from "./middleware/auth";

const app = express();
const PORT = process.env.API_PORT || 3000;

pool
  .getConnection()
  .then(async (conn) => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieparser());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/pdf", validateMe, pdfRoutes);
app.use("/purchase-order", validateMe, poRoutes);
app.use("/locations", validateMe, locationRoutes);
app.use("/deliveries", validateMe, deliveriesRoute);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("App started, listening on port", PORT);
  });
}

export default app;
