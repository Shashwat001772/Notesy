require("dotenv").config();

console.log("🔥 BACKEND SERVER STARTED");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("./models");
const { User } = db;

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= CORS =================

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ================= MIDDLEWARE =================

app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// ================= CREATE ADMIN =================

const createAdmin = async () => {
  try {
    const admin = await User.findOne({
      where: { role: "admin" },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin123",
        10
      );

      await User.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL || "admin@notesy.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error("Admin creation error:", err);
  }
};

// ================= DATABASE =================

// if (!process.env.VERCEL) {
//   db.sequelize
//     .sync({ alter: true })
//     .then(async () => {
//       console.log("✅ PostgreSQL Connected & Synced");
//       await createAdmin();
//     })
//     .catch((err) => {
//       console.error("DB Sync Error:", err);
//     });
// } else {
//   db.sequelize.authenticate()
//     .then(() => console.log("✅ DB Authenticated (Vercel)"))
//     .catch((err) => {
//       console.error("DB Auth Error (vercel):", err);
//     });
// }

db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("✅ PostgreSQL Connected & Synced");
    await createAdmin();
  })
  .catch((err) => {
    console.error("DB Sync Error:", err);
  });

// ================= ROUTES =================

app.get("/", (req, res) => {
  res.send("NOTESY Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ================= SERVER =================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;