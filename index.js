import dotenv from "dotenv";
import express from "express";
import "./config/db.js";
import { Router } from "./routes/routes.js";
import cors from "cors";

// Load environment variables
dotenv.config({ path: "./config/.env" });

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ["https://cms-client-gamma.vercel.app/"], // Specify the frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

// Define routes
app.use("/contactms", Router);

const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
