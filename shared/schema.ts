import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Supplier schema
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: json("location").$type<{ lat: number; lng: number }>().notNull(),
  address: text("address"),
  rating: integer("rating"),
  costIndex: doublePrecision("cost_index"),
  type: text("type").default("supplier"),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
});

// Warehouse schema
export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: json("location").$type<{ lat: number; lng: number }>().notNull(),
  address: text("address"),
  capacity: integer("capacity"),
  type: text("type").default("warehouse"),
});

export const insertWarehouseSchema = createInsertSchema(warehouses).omit({
  id: true,
});

// Store schema
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: json("location").$type<{ lat: number; lng: number }>().notNull(),
  address: text("address"),
  sales: integer("sales"),
  type: text("type").default("store"),
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
});

// Shipment schema
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  shipmentId: text("shipment_id").notNull().unique(),
  product: text("product").notNull(),
  source: json("source").$type<{ lat: number; lng: number }>().notNull(),
  destination: json("destination").$type<{ lat: number; lng: number }>().notNull(),
  sourceId: integer("source_id"),
  destinationId: integer("destination_id"),
  cost: doublePrecision("cost").notNull(),
  eta: timestamp("eta").notNull(),
  actualTime: timestamp("actual_time"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
});

// KPI schema
export const kpis = pgTable("kpis", {
  id: serial("id").primaryKey(),
  totalShipments: integer("total_shipments").notNull(),
  avgCost: doublePrecision("avg_cost").notNull(),
  onTimePercentage: doublePrecision("on_time_percentage").notNull(),
  delayedCount: integer("delayed_count").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertKpiSchema = createInsertSchema(kpis).omit({
  id: true,
  updatedAt: true,
});

// Shipment data over time
export const shipmentTrends = pgTable("shipment_trends", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  count: integer("count").notNull(),
  year: integer("year").notNull()
});

export const insertShipmentTrendSchema = createInsertSchema(shipmentTrends).omit({
  id: true,
});

// Export types
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type Warehouse = typeof warehouses.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;

export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type KPI = typeof kpis.$inferSelect;

export type InsertShipmentTrend = z.infer<typeof insertShipmentTrendSchema>;
export type ShipmentTrend = typeof shipmentTrends.$inferSelect;

// Location type for maps
export type LocationPoint = {
  lat: number;
  lng: number;
};

// Facility type combining suppliers, warehouses, and stores for map display
export type Facility = {
  id: number;
  name: string;
  location: LocationPoint;
  type: 'supplier' | 'warehouse' | 'store';
};
