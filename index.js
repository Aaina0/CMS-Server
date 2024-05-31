import dotenv from "dotenv";
import express from "express";
import "./config/db.js";
import { Router } from "./routes/routes.js";
import cors from "cors";
import helmet from "helmet";

// Load environment variables
dotenv.config({ path: "./config/.env" });

const app = express();

// Security middleware
app.use(helmet());

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "https://cms-client-gamma.vercel.app", // Specify the frontend origin without trailing slash
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Preflight request handling
app.options("*", cors(corsOptions));

// Define routes
app.use("/contactms", Router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
