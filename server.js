import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/DB.js";
import healthRoute from "./routes/healthRoute.js";
import errorMiddleware from "./middleware/errorMiddleWare.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

// Parse JSON
app.use(express.json());

// Health check
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
