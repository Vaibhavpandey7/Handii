const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require('./models/User');
const Worker = require('./models/Worker');

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urban_services";
    await mongoose.connect(MONGO_URI);

    console.log("Dropping existing collections for clean seed...");
    await mongoose.connection.db.dropDatabase();

    // 1. Seed Accounts
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Admin Account
    const admin = new User({ name: "Admin Setup", email: "admin@handii.com", password: hashedPassword, role: "admin" });
    await admin.save();
    
    // Normal Client Account
    const client = new User({ name: "Vaibhav (Client)", email: "vaibhav@client.com", password: hashedPassword, role: "user" });
    await client.save();

    // Worker Accounts
    const wUser1 = new User({ name: "Ravi Kumar", email: "ravi@worker.com", password: hashedPassword, role: "worker" });
    const wUser2 = new User({ name: "Pooja N", email: "pooja@worker.com", password: hashedPassword, role: "worker" });
    const wUser3 = new User({ name: "Imran Khan", email: "imran@worker.com", password: hashedPassword, role: "worker" });
    
    await User.insertMany([wUser1, wUser2, wUser3]);

    // 2. Seed Worker Profiles linked to Users
    const workers = [
      { userId: wUser1._id, name: wUser1.name, service_type: "Plumber", phone: "9876543210", rating: 4.6, location: "Downtown", experience: 6, availability: true, verified: true },
      { userId: wUser2._id, name: wUser2.name, service_type: "Painter", phone: "9876509999", rating: 4.8, location: "Uptown", experience: 8, availability: true, verified: true },
      { userId: wUser3._id, name: wUser3.name, service_type: "AC Technician", phone: "9876512345", rating: 4.5, location: "Midtown", experience: 5, availability: true, verified: false }
    ];

    await Worker.insertMany(workers);
    
    console.log("✅ Seed Successful!");
    console.log("-----------------------------------------");
    console.log("🔐 ADMIN LOGIN:");
    console.log("Email: admin@handii.com | Password: password123");
    console.log("-----------------------------------------");
    console.log("🔐 CLIENT LOGIN:");
    console.log("Email: vaibhav@client.com | Password: password123");
    console.log("-----------------------------------------");
    console.log("🔐 WORKER LOGIN:");
    console.log("Email: ravi@worker.com | Password: password123");
    console.log("-----------------------------------------");

  } catch (e) {
    console.error("❌ Seed error:", e);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
