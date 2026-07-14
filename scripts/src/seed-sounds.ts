// Seed script to populate the sounds database
// This script imports the hardcoded sounds data and inserts it into the PostgreSQL database

import { db } from "@workspace/db";
import { soundsTable, categoriesTable } from "@workspace/db";
import { SOUNDS } from "../../jjs-soundboard/src/data/sounds.ts";

async function seedDatabase() {
  console.log("Starting database seed...");

  // First, let's extract unique categories from the sounds data
  const uniqueCategories = Array.from(
    new Set(SOUNDS.map((sound) => sound.category))
  ).sort();

  console.log(`Found ${uniqueCategories.length} unique categories: ${uniqueCategories.join(", ")}`);

  // Insert categories (if they don't already exist)
  for (const categoryName of uniqueCategories) {
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    try {
      await db
        .insert(categoriesTable)
        .values({
          name: categoryName,
          slug,
          sortOrder: 0
        })
        .onConflictDoNothing();
      console.log(`✓ Inserted category: ${categoryName}`);
    } catch (error) {
      console.error(`Error inserting category ${categoryName}:`, error);
    }
  }

  console.log(`\nStarting to seed ${SOUNDS.length} sounds...`);

  // Insert sounds (only if they don't already exist based on robloxId)
  let insertedCount = 0;

  for (const sound of SOUNDS) {
    try {
      const result = await db
        .insert(soundsTable)
        .values({
          title: sound.title,
          category: sound.category,
          robloxId: sound.robloxId,
          character: sound.category.includes(" ") ? sound.category.split(" ")[0] : null
        })
        .onConflictDoNothing();

      if (result.rowCount > 0) {
        insertedCount++;
        if (insertedCount % 100 === 0) {
          process.stdout.write(".");
        }
      }
    } catch (error) {
      // Skip sounds that might already exist or have validation errors
      console.log(`Note: Sound ${sound.id} (${sound.title}) - ${error}`);
    }
  }

  console.log(`\n\n✓ Successfully seeded ${insertedCount} sounds!`);
  console.log("Database seed completed. ✅");
}

// Execute the seed function
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seed script failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };