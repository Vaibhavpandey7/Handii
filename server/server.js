const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Worker = require("./models/Worker");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the parent "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Add a worker
app.post("/api/workers", async (req, res) => {
  try {
    const { name, service_type, location, rating, phone, experience, availability } = req.body;

    // Basic validation
    if (!name || !service_type || !location) {
      return res.status(400).json({ error: "Name, service_type, and location are required." });
    }

    const worker = new Worker({ name, service_type, location, rating, phone, experience, availability });
    await worker.save();
    res.status(201).json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get workers by service and location (single consolidated handler)
app.get("/api/workers", async (req, res) => {
  try {
    const { service, location } = req.query;
    const filter = {};

    if (service && service.trim() !== "") filter.service_type = new RegExp(service, "i");
    if (location && location.trim() !== "") filter.location = new RegExp(location, "i");

    const workers = await Worker.find(filter);
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb://localhost:27017/urban_services")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
