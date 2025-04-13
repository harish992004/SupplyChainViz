import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Location schema (lat, lng)
export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export type Location = z.infer<typeof locationSchema>;

// Supplier schema
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: json("location").$type<Location>().notNull(),
  type: text("type").notNull().default("supplier"),
  rating: integer("rating").notNull().default(5),
  costIndex: doublePrecision("cost_index").notNull().default(1.0),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Shipment status enum
export const ShipmentStatus = {
  PROCESSING: "processing",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  DELAYED: "delayed"
} as const;

export type ShipmentStatusType = typeof ShipmentStatus[keyof typeof ShipmentStatus];

// Shipment schema
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  cost: doublePrecision("cost").notNull(),
  eta: timestamp("eta").notNull(),
  actualTime: timestamp("actual_time"),
  status: text("status").notNull().default(ShipmentStatus.PROCESSING),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
  actualTime: true,
});

export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;

// Define the types for dashboard KPIs
export interface DashboardKPI {
  totalShipments: number;
  avgCost: number;
  onTimePercentage: number;
  delayedShipments: number;
  shipmentsOverTime: { month: string; count: number }[];
}

// Location type for map
export const locationType = {
  SUPPLIER: "supplier",
  WAREHOUSE: "warehouse", 
  STORE: "store"
} as const;

export type LocationType = typeof locationType[keyof typeof locationType];

// Users schema (kept from original file)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
