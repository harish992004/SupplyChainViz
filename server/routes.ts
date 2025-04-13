import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShipmentSchema, insertSupplierSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiPrefix = '/api';
  
  // Suppliers API endpoints
  app.get(`${apiPrefix}/suppliers`, async (_req: Request, res: Response) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers", error });
    }
  });
  
  app.get(`${apiPrefix}/suppliers/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
      }
      
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier", error });
    }
  });
  
  app.post(`${apiPrefix}/suppliers`, async (req: Request, res: Response) => {
    try {
      const parseResult = insertSupplierSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Invalid supplier data", 
          errors: validationError.details 
        });
      }
      
      const supplier = await storage.createSupplier(parseResult.data);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to create supplier", error });
    }
  });
  
  // Shipments API endpoints
  app.get(`${apiPrefix}/shipments`, async (_req: Request, res: Response) => {
    try {
      const shipments = await storage.getShipments();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipments", error });
    }
  });
  
  app.get(`${apiPrefix}/shipments/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      
      const shipment = await storage.getShipment(id);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shipment", error });
    }
  });
  
  app.post(`${apiPrefix}/shipments`, async (req: Request, res: Response) => {
    try {
      const parseResult = insertShipmentSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          message: "Invalid shipment data", 
          errors: validationError.details 
        });
      }
      
      const shipment = await storage.createShipment(parseResult.data);
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create shipment", error });
    }
  });
  
  app.patch(`${apiPrefix}/shipments/:id/status`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const shipment = await storage.updateShipmentStatus(id, status);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update shipment status", error });
    }
  });
  
  // Dashboard KPI endpoint
  app.get(`${apiPrefix}/dashboard/kpi`, async (_req: Request, res: Response) => {
    try {
      const kpiData = await storage.getDashboardKPI();
      res.json(kpiData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPI data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
