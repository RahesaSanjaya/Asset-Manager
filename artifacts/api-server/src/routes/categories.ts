import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";

const router: IRouter = Router();

// GET all categories ordered by sortOrder
router.get("/categories", async (_req, res) => {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .orderBy(categoriesTable.sortOrder);

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;