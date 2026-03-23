require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ CORS FIX (VERY IMPORTANT)
app.use(
  cors({
    origin: "https://your-netlify-site.netlify.app", // 🔴 replace this
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ ROUTES
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/quiz", require("./routes/quiz.routes"));
app.use("/api/essay", require("./routes/essay.routes"));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ❌ OPTIONAL (for debugging)
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

module.exports = app;