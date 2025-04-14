import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import usersRouter from "./routes/usersRouter.js";
import storesRouter from "./routes/storesRouter.js";
import productsRouter from "./routes/productsRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import cartRouter from "./routes/cartRouter.js";

const { DB_HOST, PORT = 3000 } = process.env;

export const app = express();

app.use(morgan("tiny"));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://easy-pharma.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", usersRouter);

app.use("/api/stores", storesRouter);
app.use("/api/products", productsRouter);
app.use("/api/customer-reviews", reviewsRouter);
app.use("/api/cart", cartRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
