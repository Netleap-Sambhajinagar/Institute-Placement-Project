import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import internRoutes from "./routes/internRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import courseEnrollmentRoutes from "./routes/courseEnrollmentRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import placedStudentRoutes from "./routes/placedStudentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import sequelize from "./config/db.js";

import "./models/studentsModel.js";
import "./models/adminModel.js";
import "./models/internModel.js";
import "./models/internshipModel.js";
import "./models/courseModel.js";
import "./models/courseEnrollmentModel.js";
import "./models/jobsModel.js";
import "./models/placedStudentModel.js";

dotenv.config();

const app = express();
const allowedOrigins = (
  process.env.CLIENT_URLS || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", internRoutes);
app.use("/api", internshipRoutes);
app.use("/api", courseRoutes);
app.use("/api", courseEnrollmentRoutes);
app.use("/api", jobsRoutes);
app.use("/api", placedStudentRoutes);
app.use("/api", dashboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
const SHOULD_SYNC = process.env.DB_SYNC === "true";

const startServer = async () => {
  await sequelize.authenticate();
  console.log("Database connected");

  if (SHOULD_SYNC) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Database synced");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Database startup error:", err.message);
});
