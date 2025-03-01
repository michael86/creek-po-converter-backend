import dotenv from "dotenv";
dotenv.config(); //load env variabls first

import express from "express";
import userRoutes from "./routes/user";
import pool from "./db/config";

const PORT = process.env.API_PORT || 3000;
const app = express();

pool
  .getConnection()
  .then(async (conn) => {
    console.log("✅ Database connected successfully!");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

app.use(express.json());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log("App started, listening on port ", PORT);
});
