import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSupplierSchema, insertWarehouseSchema, insertStoreSchema, insertShipmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Suppliers endpoints
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get suppliers" });
    }
  });
  
  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to get supplier" });
    }
  });
  
  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });
  
  // Warehouses endpoints
  app.get("/api/warehouses", async (req, res) => {
    try {
      const warehouses = await storage.getWarehouses();
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get warehouses" });
    }
  });
  
  app.post("/api/warehouses", async (req, res) => {
    try {
      const validatedData = insertWarehouseSchema.parse(req.body);
      const warehouse = await storage.createWarehouse(validatedData);
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(400).json({ message: "Invalid warehouse data" });
    }
  });
  
  // Stores endpoints
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stores" });
    }
  });
  
  app.post("/api/stores", async (req, res) => {
    try {
      const validatedData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(validatedData);
      res.status(201).json(store);
    } catch (error) {
      res.status(400).json({ message: "Invalid store data" });
    }
  });
  
  // Shipments endpoints
  app.get("/api/shipments", async (req, res) => {
    try {
      const shipments = await storage.getShipments();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shipments" });
    }
  });
  
  app.get("/api/shipments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shipment = await storage.getShipment(id);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shipment" });
    }
  });
  
  app.post("/api/shipments", async (req, res) => {
    try {
      const validatedData = insertShipmentSchema.parse(req.body);
      const shipment = await storage.createShipment(validatedData);
      res.status(201).json(shipment);
    } catch (error) {
      res.status(400).json({ message: "Invalid shipment data" });
    }
  });
  
  // KPI Dashboard endpoint
  app.get("/api/dashboard/kpi", async (req, res) => {
    try {
      const kpis = await storage.getKPIs();
      
      if (!kpis) {
        // If KPIs don't exist, create them
        const newKpis = await storage.updateKPIs();
        return res.json(newKpis);
      }
      
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to get KPI data" });
    }
  });
  
  // Shipment trends endpoint
  app.get("/api/dashboard/shipment-trends", async (req, res) => {
    try {
      const trends = await storage.getShipmentTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shipment trends" });
    }
  });
  
  // Facilities endpoint (all locations for map)
  app.get("/api/facilities", async (req, res) => {
    try {
      const facilities = await storage.getAllFacilities();
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get facilities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
