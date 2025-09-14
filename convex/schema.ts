import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  calculations: defineTable({
    query: v.string(),
    result: v.union(v.number(), v.string()),
    steps: v.array(v.string()),
    type: v.union(
      v.literal("stock"),
      v.literal("currency"), 
      v.literal("nutrition"),
      v.literal("math"),
      v.literal("mixed")
    ),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});