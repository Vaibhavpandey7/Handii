const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Worker = require("./models/Worker");
const Booking = require("./models/Booking");
const { verifyToken, verifyRole, JWT_SECRET } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());

// API Health Check Route
app.get("/", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send("Database working");
  } else {
    res.send("Database not working");
  }
});

// --- AUTHENTICATION ROUTES ---

// Auth Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Don't allow public passing of 'admin'
    const userRole = role && ['user', 'worker'].includes(role) ? role : 'user';

    const user = new User({ name, email, password: hashedPassword, role: userRole });
    await user.save();
    
    // Auto-login after registration
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Auth Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- ENTITY ROUTES ---

// Add a worker (Requires 'worker' role)
app.post("/api/workers", verifyToken, verifyRole(['worker', 'admin']), async (req, res) => {
  try {
    const { name, service_type, location, rating, phone, experience, availability } = req.body;

    if (!name || !service_type || !location) {
      return res.status(400).json({ error: "Name, service_type, and location are required." });
    }

    // Link the worker profile to the currently logged in user
    const worker = new Worker({ 
      userId: req.user.id,
      name, service_type, location, rating, phone, experience, availability 
    });
    
    await worker.save();
    res.status(201).json(worker);
  } catch (err) {
    console.error("Worker creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get verified workers (Public)
app.get("/api/workers", async (req, res) => {
  try {
    const { service, location, all } = req.query;
    const filter = {};

    if (all !== 'true') filter.verified = true; 

    if (service && service.trim() !== "") filter.service_type = new RegExp(service, "i");
    if (location && location.trim() !== "") {
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
app.patch("/api/admin/workers/:id/verify", verifyToken, verifyRole(['admin']), async (req, res) => {
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
app.delete("/api/admin/workers/:id", verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- BOOKING ROUTES ---

// Create a new Booking (Requires 'user' role)
app.post("/api/bookings", verifyToken, verifyRole(['user']), async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ error: "workerId required" });
    
    // Strictly inject the userId securely from the token payload
    const booking = new Booking({ userId: req.user.id, workerId });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get booking with messages
app.get("/api/bookings/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('workerId');
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all bookings for the logged-in User
app.get("/api/bookings/user/me", verifyToken, verifyRole(['user', 'admin']), async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('workerId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all bookings for the logged-in Worker
app.get("/api/bookings/worker/me", verifyToken, verifyRole(['worker', 'admin']), async (req, res) => {
  try {
    // We must find the worker profile associated with this user ID
    const workerProfile = await Worker.findOne({ userId: req.user.id });
    if (!workerProfile) return res.status(404).json({ error: "Worker profile not found for this account." });

    const bookings = await Booking.find({ workerId: workerProfile._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update booking status (Requires 'worker' role)
app.patch("/api/bookings/:id/status", verifyToken, verifyRole(['worker', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('workerId');
    
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add message to booking
app.post("/api/bookings/:id/messages", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "message text required" });
    
    const sender = req.user.role === 'worker' ? 'Worker' : 'User';

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
