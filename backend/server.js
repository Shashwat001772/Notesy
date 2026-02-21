require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./models");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

db.sequelize.sync().then(() => {
  console.log("✅ PostgreSQL Connected & Synced");
});

app.get("/", (req, res) => {
  res.send("NOTESY Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
