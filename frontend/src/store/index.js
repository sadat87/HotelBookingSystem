import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // MUST be first

console.log("DEBUG MONGO_URI =", process.env.MONGO_URI);

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
