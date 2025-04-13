import { 
  suppliers, shipments, 
  type Supplier, type InsertSupplier, 
  type Shipment, type InsertShipment,
  type DashboardKPI, type ShipmentsByMonth,
  LocationType, ShipmentStatus
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // Supplier operations
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Shipment operations
  getAllShipments(): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  
  // Dashboard operations
  getDashboardKPI(): Promise<DashboardKPI>;
  getShipmentsOverTime(): Promise<ShipmentsByMonth[]>;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private suppliers: Map<number, Supplier>;
  private shipments: Map<number, Shipment>;
  private supplierId: number;
  private shipmentId: number;

  constructor() {
    this.suppliers = new Map();
    this.shipments = new Map();
    this.supplierId = 1;
    this.shipmentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample suppliers
    const sampleSuppliers: InsertSupplier[] = [
      { name: "Stockholm Supplier", latitude: 59.3293, longitude: 18.0686, locationType: LocationType.SUPPLIER, city: "Stockholm", country: "Sweden", rating: 4, costIndex: 3.2 },
      { name: "Copenhagen Warehouse", latitude: 55.6761, longitude: 12.5683, locationType: LocationType.WAREHOUSE, city: "Copenhagen", country: "Denmark", rating: 5, costIndex: 2.8 },
      { name: "Hamburg Store", latitude: 53.5511, longitude: 9.9937, locationType: LocationType.STORE, city: "Hamburg", country: "Germany", rating: 4, costIndex: 2.5 },
      { name: "Berlin Warehouse", latitude: 52.5200, longitude: 13.4050, locationType: LocationType.WAREHOUSE, city: "Berlin", country: "Germany", rating: 5, costIndex: 2.7 },
      { name: "Paris Store", latitude: 48.8566, longitude: 2.3522, locationType: LocationType.STORE, city: "Paris", country: "France", rating: 3, costIndex: 3.0 },
      { name: "London Supplier", latitude: 51.5074, longitude: -0.1278, locationType: LocationType.SUPPLIER, city: "London", country: "UK", rating: 5, costIndex: 3.5 },
      { name: "Madrid Store", latitude: 40.4168, longitude: -3.7038, locationType: LocationType.STORE, city: "Madrid", country: "Spain", rating: 4, costIndex: 2.3 },
      { name: "Rome Warehouse", latitude: 41.9028, longitude: 12.4964, locationType: LocationType.WAREHOUSE, city: "Rome", country: "Italy", rating: 3, costIndex: 2.4 },
      { name: "Warsaw Warehouse", latitude: 52.2297, longitude: 21.0122, locationType: LocationType.WAREHOUSE, city: "Warsaw", country: "Poland", rating: 4, costIndex: 1.9 },
      { name: "Moscow Supplier", latitude: 55.7558, longitude: 37.6173, locationType: LocationType.SUPPLIER, city: "Moscow", country: "Russia", rating: 3, costIndex: 2.0 },
      { name: "Soligar Store", latitude: 42.0200, longitude: 14.0050, locationType: LocationType.STORE, city: "Soligar", country: "Italy", rating: 4, costIndex: 2.1 }
    ];

    sampleSuppliers.forEach(supplier => this.createSupplier(supplier));

    // Add sample shipments
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const fourDaysLater = new Date(now);
    fourDaysLater.setDate(fourDaysLater.getDate() + 4);

    const sampleShipments: InsertShipment[] = [
      { 
        shipmentId: "SH-3945", 
        sourceId: 1, 
        destinationId: 4, 
        productName: "Electronics", 
        cost: 4.32, 
        departureDate: yesterday, 
        eta: tomorrow, 
        actualDeliveryDate: null, 
        status: ShipmentStatus.IN_TRANSIT 
      },
      { 
        shipmentId: "SH-3944", 
        sourceId: 6, 
        destinationId: 5, 
        productName: "Clothing", 
        cost: 3.75, 
        departureDate: twoDaysAgo, 
        eta: yesterday, 
        actualDeliveryDate: null, 
        status: ShipmentStatus.DELAYED 
      },
      { 
        shipmentId: "SH-3943", 
        sourceId: 10, 
        destinationId: 9, 
        productName: "Raw Materials", 
        cost: 5.20, 
        departureDate: threeDaysAgo, 
        eta: now, 
        actualDeliveryDate: now, 
        status: ShipmentStatus.DELIVERED 
      },
      { 
        shipmentId: "SH-3942", 
        sourceId: 7, 
        destinationId: 11, 
        productName: "Food Products", 
        cost: 2.95, 
        departureDate: threeDaysAgo, 
        eta: yesterday, 
        actualDeliveryDate: null, 
        status: ShipmentStatus.CRITICAL 
      },
      { 
        shipmentId: "SH-3941", 
        sourceId: 2, 
        destinationId: 3, 
        productName: "Medical Supplies", 
        cost: 6.10, 
        departureDate: yesterday, 
        eta: threeDaysLater, 
        actualDeliveryDate: null, 
        status: ShipmentStatus.IN_TRANSIT 
      }
    ];

    // Create more shipments for the historical data (for chart)
    const monthsBack = 9;
    for (let i = 0; i < 70; i++) {
      const randomDaysAgo = Math.floor(Math.random() * (monthsBack * 30));
      const departureDate = new Date(now);
      departureDate.setDate(departureDate.getDate() - randomDaysAgo);
      
      const etaDays = Math.floor(Math.random() * 5) + 1;
      const etaDate = new Date(departureDate);
      etaDate.setDate(etaDate.getDate() + etaDays);
      
      const actualDeliveryDays = Math.random() > 0.2 ? etaDays : etaDays + Math.floor(Math.random() * 3) + 1;
      const actualDeliveryDate = new Date(departureDate);
      actualDeliveryDate.setDate(actualDeliveryDate.getDate() + actualDeliveryDays);
      
      const status = actualDeliveryDays <= etaDays ? ShipmentStatus.DELIVERED 
                    : actualDeliveryDays - etaDays > 2 ? ShipmentStatus.CRITICAL 
                    : ShipmentStatus.DELAYED;
      
      const sourceId = Math.floor(Math.random() * sampleSuppliers.length) + 1;
      let destinationId = Math.floor(Math.random() * sampleSuppliers.length) + 1;
      while (destinationId === sourceId) {
        destinationId = Math.floor(Math.random() * sampleSuppliers.length) + 1;
      }
      
      const isDelivered = departureDate < now && actualDeliveryDate < now;
      
      const shipment: InsertShipment = {
        shipmentId: `SH-${3940 - i}`,
        sourceId,
        destinationId,
        productName: ["Electronics", "Clothing", "Food", "Raw Materials", "Medical Supplies"][Math.floor(Math.random() * 5)],
        cost: Math.round((Math.random() * 5 + 1) * 100) / 100,
        departureDate: departureDate,
        eta: etaDate,
        actualDeliveryDate: isDelivered ? actualDeliveryDate : null,
        status: isDelivered ? status : (Math.random() > 0.8 ? ShipmentStatus.DELAYED : ShipmentStatus.IN_TRANSIT)
      };
      
      sampleShipments.push(shipment);
    }

    sampleShipments.forEach(shipment => this.createShipment(shipment));
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierId++;
    const newSupplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async getAllShipments(): Promise<Shipment[]> {
    return Array.from(this.shipments.values());
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipments.get(id);
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const id = this.shipmentId++;
    const newShipment = { ...shipment, id };
    this.shipments.set(id, newShipment);
    return newShipment;
  }

  async getDashboardKPI(): Promise<DashboardKPI> {
    const allShipments = await this.getAllShipments();
    
    const totalShipments = allShipments.length;
    
    // Calculate average cost
    const totalCost = allShipments.reduce((sum, shipment) => sum + shipment.cost, 0);
    const averageCostPerShipment = totalCost / (totalShipments || 1);
    
    // Calculate on-time deliveries
    const deliveredShipments = allShipments.filter(s => 
      s.actualDeliveryDate !== null && s.status === ShipmentStatus.DELIVERED
    );
    
    const onTimeDeliveries = deliveredShipments.length;
    
    // Calculate on-time percentage
    const onTimePercentage = (onTimeDeliveries / (totalShipments || 1)) * 100;
    
    // Count delayed shipments
    const delayedShipments = allShipments.filter(s => 
      s.status === ShipmentStatus.DELAYED || s.status === ShipmentStatus.CRITICAL
    ).length;
    
    return {
      totalShipments,
      averageCostPerShipment,
      onTimeDeliveries,
      onTimePercentage,
      delayedShipments
    };
  }

  async getShipmentsOverTime(): Promise<ShipmentsByMonth[]> {
    const allShipments = await this.getAllShipments();
    const now = new Date();
    const monthsData: Record<string, number> = {};
    
    // Initialize last 10 months
    for (let i = 9; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short' });
      monthsData[monthKey] = 0;
    }
    
    // Count shipments per month
    allShipments.forEach(shipment => {
      const departureDate = new Date(shipment.departureDate);
      const monthKey = departureDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (monthsData[monthKey] !== undefined) {
        monthsData[monthKey]++;
      }
    });
    
    // Convert to required format
    return Object.entries(monthsData).map(([month, count]) => ({ month, count }));
  }
}

export const storage = new MemStorage();
