import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";

dotenv.config();

const PORT = process.env.API_PORT || 3000;

const app = express();

app.use(express.json());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log("App started, listening on port ", PORT);
});
