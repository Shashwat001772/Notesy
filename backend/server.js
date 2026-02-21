require("dotenv").config();

console.log("🔥 BACKEND SERVER STARTED");

const express = require("express");
const cors = require("cors");
const db = require("./models");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from our frontends.  During development the Next.js server
// might be reached as "localhost" or "127.0.0.1", so we permit both.
// In production we only allow the deployed URL(s).
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
}); 

// In a serverless environment every invocation re‑imports this module,
// so calling `sync()` on every run will try to alter the schema repeatedly and
// may exhaust connection limits or slow down cold starts.  Run migrations
// manually or only sync when running locally.
if (!process.env.VERCEL) {
  db.sequelize.sync({ alter: true })
    .then(() => {
      console.log("✅ PostgreSQL Connected & Synced");
    })
    .catch((err) => {
      console.error("DB Sync Error:", err);
    });
} else {
  // still authenticate so we at least log connection success/failure
  db.sequelize.authenticate().catch((err) => {
    console.error("DB Auth Error (vercel):", err);
  });
}

app.get("/", (req, res) => {
  res.send("NOTESY Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// When running on Vercel (or any serverless platform) we must *not* call
// app.listen. Vercel will invoke the exported handler for each request.
// The `require.main === module` check allows us to still start a local HTTP
// server when running `node server.js` (e.g. during development).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// export the express application instance so that a serverless wrapper
// (e.g. serverless-http) can turn it into a lambda-style handler.
module.exports = app;