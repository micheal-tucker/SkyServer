const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Schema for SOS
const sosSchema = new mongoose.Schema({
  name: String,
  message: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }
});

const SOS = mongoose.model("SOS", sosSchema);

// API endpoint
app.post("/api/alerts", async (req, res) => {
  try {
    const alert = new SOS(req.body);
    await alert.save();
    res.json({ success: true, message: "SOS received!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all alerts
app.get("/api/alerts", async (req, res) => {
  const alerts = await SOS.find().sort({ timestamp: -1 });
  res.json(alerts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
