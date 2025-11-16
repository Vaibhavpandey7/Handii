const mongoose = require("mongoose");
const Worker = require('./models/Worker');

async function seed() {
  try {
      await mongoose.connect("mongodb://127.0.0.1:27017/urbanclap_clone");

    await Worker.deleteMany({});

    const workers = [
      { name: "Ravi Kumar", service_type: "Plumber", phone: "9876543210", rating: 4.6, location: "Koramangala", experience: 6, availability: true },
      { name: "Amit Sharma", service_type: "Electrician", phone: "9876501234", rating: 4.7, location: "Indiranagar", experience: 7, availability: true },
      { name: "Suresh R", service_type: "Carpenter", phone: "9876505678", rating: 4.2, location: "HSR Layout", experience: 4, availability: false },
      { name: "Pooja N", service_type: "Painter", phone: "9876509999", rating: 4.8, location: "BTM Layout", experience: 8, availability: true },
      { name: "Imran Khan", service_type: "AC Technician", phone: "9876512345", rating: 4.5, location: "Jayanagar", experience: 5, availability: true },
      { name: "Lakshmi Rao", service_type: "Cleaner", phone: "9876516789", rating: 4.1, location: "Whitefield", experience: 3, availability: false },
      { name: "Rahul Verma", service_type: "Mechanic", phone: "9876523456", rating: 4.3, location: "Marathahalli", experience: 5, availability: true }
    ];

    await Worker.insertMany(workers);
    console.log("✅ Seeded workers:", workers.length);
  } catch (e) {
    console.error("❌ Seed error:", e);
  } finally {
    await mongoose.disconnect();
  }
}

seed();


