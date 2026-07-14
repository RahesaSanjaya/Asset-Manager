import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const soundsTable = pgTable("sounds", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  robloxId: text("roblox_id").notNull(),
  character: text("character"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const insertSoundSchema = createInsertSchema(soundsTable)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    robloxId: z.string().transform((v) => String(v)),
  });

export type InsertSound = z.infer<typeof insertSoundSchema>;
export type Sound = typeof soundsTable.$inferSelect;