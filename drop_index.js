import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    const Members = mongoose.connection.collection("members");
    await Members.dropIndex("phone_1");
    console.log("Successfully dropped phone_1 index.");
  } catch (err) {
    if (err.code === 27) {
      console.log("Index phone_1 does not exist, skipping.");
    } else {
      console.error("Error:", err.message);
    }
  } finally {
    await mongoose.disconnect();
  }
}

run();
