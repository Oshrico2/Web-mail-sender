// Load env before any module that reads process.env at import time
// (the mail transporters are created when their route modules load).
import "dotenv/config";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import agentsRoutes from "./routes/agentsRoutes.js";
import employeeRoutes from "./routes/employeesRoutes.js";
import programRoutes from "./routes/programsRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import mailingRoutes from "./routes/mailingRoutes.js";
import campaignsRoutes from "./routes/campaignsRoutes.js";
import businessManagersRoutes from "./routes/businessManagersRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userActivityRoutes from "./routes/userActivityRoutes.js";
import removeMailingRoutes from "./routes/removeMailingRoutes.js";
import { admin, protect } from "./middleware/authMiddleware.js";
import { errorHandler, notFound } from "./utils/http.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set; refusing to start.");
  process.exit(1);
}

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Render sits behind a proxy; needed for secure cookies and req.ip.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "same-origin");
  next();
});

app.use(cookieParser());
// The status and report screens post the whole parsed Excel sheet as JSON.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api/login", loginRoutes);
app.use("/api/remove-mailing", removeMailingRoutes);
app.use("/api/agents", protect, agentsRoutes);
app.use("/api/employees", protect, employeeRoutes);
app.use("/api/campaigns", protect, campaignsRoutes);
app.use("/api/programs", protect, programRoutes);
app.use("/api/mailing", protect, mailingRoutes);
app.use("/api/business-managers", protect, businessManagersRoutes);
app.use("/api/users", admin, userRoutes);
app.use("/api/users-activity", protect, userActivityRoutes);
app.use("/api", notFound);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  const buildDir = path.join(__dirname, "frontend", "build");
  app.use(
    "/assets",
    express.static(path.join(buildDir, "assets"), { immutable: true, maxAge: "1y" })
  );
  app.use(express.static(buildDir, { index: false }));
  app.get("*", (req, res) => res.sendFile(path.join(buildDir, "index.html")));
} else {
  app.get("/", (req, res) => res.send("API is running...."));
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
