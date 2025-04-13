import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum for location types
export const LocationType = {
  SUPPLIER: "supplier",
  WAREHOUSE: "warehouse",
  STORE: "store",
} as const;

export type LocationTypeValues = typeof LocationType[keyof typeof LocationType];

// Enum for shipment status
export const ShipmentStatus = {
  PENDING: "pending",
  IN_TRANSIT: "in_transit",
  DELIVERED: "on_time",
  DELAYED: "delayed",
  CRITICAL: "critical",
} as const;

export type ShipmentStatusValues = typeof ShipmentStatus[keyof typeof ShipmentStatus];

// Supplier schema
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  locationType: text("location_type").notNull().$type<LocationTypeValues>(),
  country: text("country"),
  city: text("city").notNull(),
  rating: integer("rating"),
  costIndex: real("cost_index"),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
});

// Shipment schema
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  shipmentId: text("shipment_id").notNull(),
  sourceId: integer("source_id").notNull(),
  destinationId: integer("destination_id").notNull(),
  productName: text("product_name").notNull(),
  cost: real("cost").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  eta: timestamp("eta").notNull(),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  status: text("status").notNull().$type<ShipmentStatusValues>(),
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
});

// Dashboard KPI types
export type DashboardKPI = {
  totalShipments: number;
  averageCostPerShipment: number;
  onTimeDeliveries: number;
  onTimePercentage: number;
  delayedShipments: number;
};

export type ShipmentsByMonth = {
  month: string;
  count: number;
};

// Types export
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;
