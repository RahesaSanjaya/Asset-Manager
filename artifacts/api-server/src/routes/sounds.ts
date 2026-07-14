import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { soundsTable } from "@workspace/db";
import { z } from "zod/v4";

const soundIdSchema = z.string().transform((val) => parseInt(val, 10));
const router: IRouter = Router();

// GET all sounds with search, category filter, and pagination
router.get("/sounds", async (req, res) => {
  try {
    const { search, category, page = "1", limit = "50" } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const offset = (pageNum - 1) * limitNum;

    // Build where clause for search
    let whereClause: any = {};
    if (search) {
      whereClause = {
        OR: [
          { title: { ilike: `%${search}%` } },
          { robloxId: { ilike: `%${search}%` } },
          { category: { ilike: `%${search}%` } },
        ].filter((condition) => condition !== undefined),
      };
    }

    if (category) {
      whereClause = {
        AND: [
          ...(Object.keys(whereClause).length > 0 ? [whereClause] : []),
          { category: { ilike: `%${category}%` } },
        ].filter((condition) => condition !== undefined),
      };
    }

    // Get sounds with pagination
    const sounds = await db
      .select()
      .from(soundsTable)
      .where(whereClause)
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination
    const [{ total }] = await db
      .select({ count: soundsTable.id }) // dummy count
      .from(soundsTable)
      .where(whereClause);

    const totalCount = Number(total);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      sounds,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching sounds:", error);
    res.status(500).json({ error: "Failed to fetch sounds" });
  }
});

// GET single sound by ID
router.get("/sounds/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const soundId = soundIdSchema.parse(id);

    const [sound] = await db
      .select()
      .from(soundsTable)
      .where(soundIdSchema.parse(id));

    if (!sound) {
      return res.status(404).json({ error: "Sound not found" });
    }

    res.json(sound);
  } catch (error) {
    console.error("Error fetching sound:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid sound ID format" });
    }

    res.status(500).json({ error: "Failed to fetch sound" });
  }
});

// POST create new sound
router.post("/sounds", async (req, res) => {
  try {
    const { title, category, robloxId, character } = req.body;

    // Validate request body
    const createSoundRequest = z.object({
      title: z.string().min(1, "Title is required"),
      category: z.string().min(1, "Category is required"),
      robloxId: z.string().min(1, "Roblox ID is required"),
      character: z.string().optional(),
    });

    const validatedData = createSoundRequest.parse({ title, category, robloxId, character });

    // Check if Roblox ID already exists
    const existingSound = await db
      .select()
      .from(soundsTable)
      .where(soundsTable.robloxId, validatedData.robloxId);

    if (existingSound.length > 0) {
      return res.status(409).json({ error: "Sound with this Roblox ID already exists" });
    }

    // Insert new sound
    const [newSound] = await db
      .insert(soundsTable)
      .values(validatedData)
      .returning();

    res.status(201).json(newSound);
  } catch (error) {
    console.error("Error creating sound:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({ error: "Failed to create sound" });
  }
});

// PUT update existing sound
router.put("/sounds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, robloxId, character } = req.body;

    const soundId = soundIdSchema.parse(id);

    // Check if sound exists
    const [existingSound] = await db
      .select()
      .from(soundsTable)
      .where(soundIdSchema.parse(id));

    if (!existingSound) {
      return res.status(404).json({ error: "Sound not found" });
    }

    // Check if Roblox ID is being changed and already exists
    if (robloxId && robloxId !== existingSound.robloxId) {
      const conflictingSound = await db
        .select()
        .from(soundsTable)
        .where(soundsTable.robloxId, robloxId);

      if (conflictingSound.length > 0) {
        return res.status(409).json({ error: "Sound with this Roblox ID already exists" });
      }
    }

    // Update sound
    const [updatedSound] = await db
      .update(soundsTable)
      .set({
        title: title ?? existingSound.title,
        category: category ?? existingSound.category,
        robloxId: robloxId ?? existingSound.robloxId,
        character: character ?? existingSound.character,
        updatedAt: new Date(),
      })
      .where(soundIdSchema.parse(id))
      .returning();

    res.json(updatedSound);
  } catch (error) {
    console.error("Error updating sound:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid sound ID format" });
    }

    res.status(500).json({ error: "Failed to update sound" });
  }
});

// DELETE sound
router.delete("/sounds/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const soundId = soundIdSchema.parse(id);

    // Check if sound exists
    const [existingSound] = await db
      .select()
      .from(soundsTable)
      .where(soundIdSchema.parse(id));

    if (!existingSound) {
      return res.status(404).json({ error: "Sound not found" });
    }

    // Delete sound
    await db
      .delete()
      .from(soundsTable)
      .where(soundIdSchema.parse(id));

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting sound:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid sound ID format" });
    }

    res.status(500).json({ error: "Failed to delete sound" });
  }
});

export default router;