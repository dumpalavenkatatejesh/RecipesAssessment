import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "../models/Recipe.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Read file
    let raw = fs.readFileSync(process.env.JSON_PATH, "utf-8");

    // Replace NaN with null so JSON.parse works
    raw = raw.replace(/\bNaN\b/g, "null");

    const data = JSON.parse(raw);

    // Ensure it's an array (if file is an object of recipes)
    const recipes = Array.isArray(data) ? data : Object.values(data);

    console.log(`Importing ${recipes.length} recipes...`);

    // Clean and insert
    const cleaned = recipes
  .filter(r => r.title && r.title.trim() !== "") // keep only recipes with title
  .map((r) => ({
    cuisine: r.cuisine || null,
    title: r.title,
    rating: isNaN(r.rating) ? null : r.rating,
    prep_time: isNaN(r.prep_time) ? null : r.prep_time,
    cook_time: isNaN(r.cook_time) ? null : r.cook_time,
    total_time: isNaN(r.total_time) ? null : r.total_time,
    description: r.description || null,
    nutrients: r.nutrients || {},
    serves: r.serves || null,
  }));


    await Recipe.deleteMany({});
    await Recipe.insertMany(cleaned);

    console.log("✅ Import complete");
    process.exit();
  } catch (err) {
    console.error("Error during import:", err);
    process.exit(1);
  }
}

run();
