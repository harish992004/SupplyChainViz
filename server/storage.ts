import { 
  suppliers, type Supplier, type InsertSupplier,
  shipments, type Shipment, type InsertShipment,
  users, type User, type InsertUser,
  type DashboardKPI, type Location, ShipmentStatus, locationType
} from "@shared/schema";

export interface IStorage {
  // User methods (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Supplier methods
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Shipment methods
  getShipments(): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipmentStatus(id: number, status: string): Promise<Shipment | undefined>;
  
  // Dashboard methods
  getDashboardKPI(): Promise<DashboardKPI>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private suppliers: Map<number, Supplier>;
  private shipments: Map<number, Shipment>;
  private nextUserId: number;
  private nextSupplierId: number;
  private nextShipmentId: number;

  constructor() {
    this.users = new Map();
    this.suppliers = new Map();
    this.shipments = new Map();
    this.nextUserId = 1;
    this.nextSupplierId = 1;
    this.nextShipmentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods from original storage
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }
  
  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }
  
  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.nextSupplierId++;
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliers.set(id, supplier);
    return supplier;
  }
  
  // Shipment methods
  async getShipments(): Promise<Shipment[]> {
    return Array.from(this.shipments.values());
  }
  
  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipments.get(id);
  }
  
  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const id = this.nextShipmentId++;
    const now = new Date();
    const shipment: Shipment = { 
      ...insertShipment, 
      id, 
      createdAt: now,
      actualTime: null 
    };
    this.shipments.set(id, shipment);
    return shipment;
  }
  
  async updateShipmentStatus(id: number, status: string): Promise<Shipment | undefined> {
    const shipment = this.shipments.get(id);
    if (!shipment) return undefined;
    
    const updatedShipment = { 
      ...shipment, 
      status,
      actualTime: status === ShipmentStatus.DELIVERED ? new Date() : shipment.actualTime
    };
    
    this.shipments.set(id, updatedShipment);
    return updatedShipment;
  }
  
  // Dashboard methods
  async getDashboardKPI(): Promise<DashboardKPI> {
    const allShipments = await this.getShipments();
    
    // Calculate total shipments
    const totalShipments = allShipments.length;
    
    // Calculate average cost
    const totalCost = allShipments.reduce((sum, shipment) => sum + shipment.cost, 0);
    const avgCost = totalShipments > 0 ? totalCost / totalShipments : 0;
    
    // Calculate on-time percentage and delayed shipments
    const completedShipments = allShipments.filter(
      shipment => shipment.status === ShipmentStatus.DELIVERED
    );
    
    const delayedShipments = allShipments.filter(
      shipment => shipment.status === ShipmentStatus.DELAYED
    ).length;
    
    const onTimeDeliveries = completedShipments.filter(shipment => {
      if (!shipment.actualTime) return false;
      return new Date(shipment.actualTime) <= new Date(shipment.eta);
    }).length;
    
    const onTimePercentage = completedShipments.length > 0 
      ? (onTimeDeliveries / completedShipments.length) * 100 
      : 0;
    
    // Generate shipments over time
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const shipmentsOverTime = months.slice(0, 8).map(month => {
      return {
        month,
        count: 40 + Math.floor(Math.random() * 60) // Random count between 40 and 100
      };
    });
    
    return {
      totalShipments,
      avgCost,
      onTimePercentage,
      delayedShipments,
      shipmentsOverTime
    };
  }
  
  // Helper method to initialize sample data
  private initializeData() {
    // Add sample suppliers
    const sampleSuppliers: InsertSupplier[] = [
      { 
        name: "Supplier Stockholm", 
        location: { lat: 59.3293, lng: 18.0686 }, 
        type: locationType.SUPPLIER,
        rating: 4,
        costIndex: 1.2
      },
      { 
        name: "Supplier London", 
        location: { lat: 51.5074, lng: -0.1278 }, 
        type: locationType.SUPPLIER,
        rating: 5,
        costIndex: 1.5
      },
      { 
        name: "Supplier Berlin", 
        location: { lat: 52.5200, lng: 13.4050 }, 
        type: locationType.SUPPLIER,
        rating: 4,
        costIndex: 1.1
      },
      { 
        name: "Warehouse Helsinki", 
        location: { lat: 60.1699, lng: 24.9384 }, 
        type: locationType.WAREHOUSE,
        rating: 3,
        costIndex: 0.9
      },
      { 
        name: "Warehouse Warsaw", 
        location: { lat: 52.2297, lng: 21.0122 }, 
        type: locationType.WAREHOUSE,
        rating: 4,
        costIndex: 0.8
      },
      { 
        name: "Warehouse Paris", 
        location: { lat: 48.8566, lng: 2.3522 }, 
        type: locationType.WAREHOUSE,
        rating: 5,
        costIndex: 1.3
      },
      { 
        name: "Store Moscow", 
        location: { lat: 55.7558, lng: 37.6173 }, 
        type: locationType.STORE,
        rating: 4,
        costIndex: 0.7
      },
      { 
        name: "Store Madrid", 
        location: { lat: 40.4168, lng: -3.7038 }, 
        type: locationType.STORE,
        rating: 5,
        costIndex: 1.0
      },
      { 
        name: "Store Rome", 
        location: { lat: 41.9028, lng: 12.4964 }, 
        type: locationType.STORE,
        rating: 3,
        costIndex: 0.9
      }
    ];
    
    sampleSuppliers.forEach(supplier => {
      const id = this.nextSupplierId++;
      this.suppliers.set(id, { ...supplier, id });
    });
    
    // Add sample shipments
    const statuses = [
      ShipmentStatus.PROCESSING, 
      ShipmentStatus.IN_TRANSIT, 
      ShipmentStatus.DELIVERED, 
      ShipmentStatus.DELAYED
    ];
    
    const sourceDestinations = [
      { source: "Stockholm", destination: "Helsinki" },
      { source: "London", destination: "Paris" },
      { source: "Berlin", destination: "Warsaw" },
      { source: "Paris", destination: "Madrid" },
      { source: "Warsaw", destination: "Moscow" },
      { source: "Helsinki", destination: "Moscow" },
      { source: "Berlin", destination: "Rome" },
      { source: "London", destination: "Madrid" }
    ];
    
    for (let i = 1; i <= 25; i++) {
      const now = new Date();
      const { source, destination } = sourceDestinations[i % sourceDestinations.length];
      
      // Generate a random date within 30 days (past or future)
      const randomDays = Math.floor(Math.random() * 30) - 15;
      const eta = new Date();
      eta.setDate(now.getDate() + randomDays);
      
      const status = statuses[i % statuses.length];
      const actualTime = status === ShipmentStatus.DELIVERED 
        ? new Date(now.getTime() - 86400000 * Math.floor(Math.random() * 5)) 
        : null;
      
      const shipment: Shipment = {
        id: this.nextShipmentId++,
        productId: `PROD-${1000 + i}`,
        source,
        destination,
        cost: 2 + Math.random() * 5, // Random cost between 2 and 7
        eta,
        actualTime,
        status,
        createdAt: new Date(now.getTime() - 86400000 * Math.floor(Math.random() * 30))
      };
      
      this.shipments.set(shipment.id, shipment);
    }
  }
}

export const storage = new MemStorage();
