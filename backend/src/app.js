const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.use(errorHandler);

module.exports = app;
