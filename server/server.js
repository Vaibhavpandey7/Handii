const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Worker = require("./models/Worker");
const Booking = require("./models/Booking");

const app = express();
app.use(express.json());
app.use(cors());

// API Health Check Route
app.get("/", (req, res) => {
  // readyState 1 means fully connected to MongoDB
  if (mongoose.connection.readyState === 1) {
    res.send("Database working");
  } else {
    res.send("Database not working");
  }
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

// Get verified workers by service and fuzzy location
app.get("/api/workers", async (req, res) => {
  try {
    const { service, location, all } = req.query;
    const filter = {};

    // Allow admins to view all workers if they pass all=true
    if (all !== 'true') filter.verified = true; 

    if (service && service.trim() !== "") filter.service_type = new RegExp(service, "i");
    if (location && location.trim() !== "") {
      // Create a fuzzy search across the location string
      const searchTerms = location.trim().split(" ").join("|");
      filter.location = new RegExp(searchTerms, "i");
    }

    const workers = await Worker.find(filter);
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Verify a worker
app.patch("/api/admin/workers/:id/verify", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json({ success: true, worker });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Delete a worker
app.delete("/api/admin/workers/:id", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new Booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { userId, workerId } = req.body;
    if (!userId || !workerId) return res.status(400).json({ error: "userId and workerId required" });
    const booking = new Booking({ userId, workerId });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get booking with messages
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('workerId');
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add message to booking
app.post("/api/bookings/:id/messages", async (req, res) => {
  try {
    const { sender, text } = req.body;
    if (!sender || !text) return res.status(400).json({ error: "sender and text required" });
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.messages.push({ sender, text });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/urban_services";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
