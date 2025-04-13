import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSupplierSchema, insertShipmentSchema, ShipmentStatus } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Suppliers routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const result = insertSupplierSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid supplier data", errors: result.error.format() });
      }
      
      const newSupplier = await storage.createSupplier(result.data);
      res.status(201).json(newSupplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // Shipments routes
  app.get("/api/shipments", async (req, res) => {
    try {
      const shipments = await storage.getAllShipments();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  app.post("/api/shipments", async (req, res) => {
    try {
      const result = insertShipmentSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid shipment data", errors: result.error.format() });
      }
      
      const newShipment = await storage.createShipment(result.data);
      res.status(201).json(newShipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create shipment" });
    }
  });

  // Dashboard KPI route
  app.get("/api/dashboard/kpi", async (req, res) => {
    try {
      const kpi = await storage.getDashboardKPI();
      res.json(kpi);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPI data" });
    }
  });

  // Shipments over time route
  app.get("/api/dashboard/shipments-over-time", async (req, res) => {
    try {
      const shipmentsOverTime = await storage.getShipmentsOverTime();
      res.json(shipmentsOverTime);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipments over time data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
