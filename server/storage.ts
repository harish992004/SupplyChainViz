import { 
  suppliers, Supplier, InsertSupplier,
  warehouses, Warehouse, InsertWarehouse,
  stores, Store, InsertStore,
  shipments, Shipment, InsertShipment,
  kpis, KPI, InsertKpi,
  shipmentTrends, ShipmentTrend, InsertShipmentTrend,
  Facility
} from "@shared/schema";

export interface IStorage {
  // Supplier methods
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  
  // Warehouse methods
  getWarehouses(): Promise<Warehouse[]>;
  getWarehouse(id: number): Promise<Warehouse | undefined>;
  createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse>;
  
  // Store methods
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  
  // Shipment methods
  getShipments(): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  getShipmentByShipmentId(shipmentId: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  
  // KPI methods
  getKPIs(): Promise<KPI | undefined>;
  updateKPIs(): Promise<KPI>;
  
  // Shipment trend methods
  getShipmentTrends(): Promise<ShipmentTrend[]>;
  
  // Facility methods (combined suppliers, warehouses, stores)
  getAllFacilities(): Promise<Facility[]>;
}

export class MemStorage implements IStorage {
  private suppliers: Map<number, Supplier>;
  private warehouses: Map<number, Warehouse>;
  private stores: Map<number, Store>;
  private shipments: Map<number, Shipment>;
  private kpis: KPI | undefined;
  private shipmentTrends: ShipmentTrend[];
  
  private supplierId: number;
  private warehouseId: number;
  private storeId: number;
  private shipmentId: number;
  private shipmentTrendId: number;
  
  constructor() {
    this.suppliers = new Map();
    this.warehouses = new Map();
    this.stores = new Map();
    this.shipments = new Map();
    this.shipmentTrends = [];
    
    this.supplierId = 1;
    this.warehouseId = 1;
    this.storeId = 1;
    this.shipmentId = 1;
    this.shipmentTrendId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Sample suppliers
    const sampleSuppliers: InsertSupplier[] = [
      { name: "Supplier A", location: { lat: 59.3293, lng: 18.0686 }, type: "supplier" }, // Stockholm
      { name: "Supplier B", location: { lat: 55.6761, lng: 12.5683 }, type: "supplier" }, // Copenhagen
      { name: "Supplier C", location: { lat: 51.5074, lng: -0.1278 }, type: "supplier" }  // London
    ];
    
    // Sample warehouses
    const sampleWarehouses: InsertWarehouse[] = [
      { name: "Warehouse Berlin", location: { lat: 52.5200, lng: 13.4050 }, type: "warehouse" },
      { name: "Warehouse Paris", location: { lat: 48.8566, lng: 2.3522 }, type: "warehouse" },
      { name: "Warehouse Warsaw", location: { lat: 52.2297, lng: 21.0122 }, type: "warehouse" }
    ];
    
    // Sample stores
    const sampleStores: InsertStore[] = [
      { name: "Store Madrid", location: { lat: 40.4168, lng: -3.7038 }, type: "store" },
      { name: "Store Rome", location: { lat: 41.9028, lng: 12.4964 }, type: "store" },
      { name: "Store Vienna", location: { lat: 48.2082, lng: 16.3738 }, type: "store" }
    ];
    
    // Add suppliers
    sampleSuppliers.forEach(supplier => {
      this.createSupplier(supplier);
    });
    
    // Add warehouses
    sampleWarehouses.forEach(warehouse => {
      this.createWarehouse(warehouse);
    });
    
    // Add stores
    sampleStores.forEach(store => {
      this.createStore(store);
    });
    
    // Add sample shipments
    const sampleShipments: InsertShipment[] = [
      { 
        shipmentId: "SHP-1001", 
        product: "Electronic Components",
        source: { lat: 59.3293, lng: 18.0686 }, 
        destination: { lat: 52.5200, lng: 13.4050 },
        sourceId: 1,
        destinationId: 1,
        cost: 3.45,
        eta: new Date("2025-04-15"),
        status: "on-time"
      },
      { 
        shipmentId: "SHP-1002", 
        product: "Raw Materials",
        source: { lat: 52.2297, lng: 21.0122 }, 
        destination: { lat: 48.8566, lng: 2.3522 },
        sourceId: 3,
        destinationId: 2,
        cost: 5.21,
        eta: new Date("2025-04-18"),
        status: "in-transit"
      },
      { 
        shipmentId: "SHP-1003", 
        product: "Finished Goods",
        source: { lat: 52.5200, lng: 13.4050 }, 
        destination: { lat: 40.4168, lng: -3.7038 },
        sourceId: 1,
        destinationId: 1,
        cost: 4.87,
        eta: new Date("2025-04-10"),
        status: "delayed"
      }
    ];
    
    // Add shipments
    sampleShipments.forEach(shipment => {
      this.createShipment(shipment);
    });
    
    // Initialize KPI data
    this.updateKPIs();
    
    // Initialize shipment trends data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const data = [65, 59, 80, 81, 56, 55, 70, 80, 90, 88];
    
    months.forEach((month, index) => {
      const trend: InsertShipmentTrend = {
        month,
        count: data[index],
        year: 2025
      };
      
      this.createShipmentTrend(trend);
    });
  }
  
  // Supplier methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }
  
  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }
  
  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.supplierId++;
    const newSupplier: Supplier = { ...supplier, id };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }
  
  // Warehouse methods
  async getWarehouses(): Promise<Warehouse[]> {
    return Array.from(this.warehouses.values());
  }
  
  async getWarehouse(id: number): Promise<Warehouse | undefined> {
    return this.warehouses.get(id);
  }
  
  async createWarehouse(warehouse: InsertWarehouse): Promise<Warehouse> {
    const id = this.warehouseId++;
    const newWarehouse: Warehouse = { ...warehouse, id };
    this.warehouses.set(id, newWarehouse);
    return newWarehouse;
  }
  
  // Store methods
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }
  
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }
  
  async createStore(store: InsertStore): Promise<Store> {
    const id = this.storeId++;
    const newStore: Store = { ...store, id };
    this.stores.set(id, newStore);
    return newStore;
  }
  
  // Shipment methods
  async getShipments(): Promise<Shipment[]> {
    return Array.from(this.shipments.values());
  }
  
  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipments.get(id);
  }
  
  async getShipmentByShipmentId(shipmentId: string): Promise<Shipment | undefined> {
    return Array.from(this.shipments.values()).find(
      (shipment) => shipment.shipmentId === shipmentId
    );
  }
  
  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const id = this.shipmentId++;
    const newShipment: Shipment = { 
      ...shipment, 
      id, 
      createdAt: new Date() 
    };
    this.shipments.set(id, newShipment);
    
    // Update KPIs after adding a shipment
    this.updateKPIs();
    
    return newShipment;
  }
  
  // KPI methods
  async getKPIs(): Promise<KPI | undefined> {
    return this.kpis;
  }
  
  async updateKPIs(): Promise<KPI> {
    const shipments = await this.getShipments();
    
    const totalShipments = shipments.length;
    const totalCost = shipments.reduce((sum, shipment) => sum + shipment.cost, 0);
    const avgCost = totalShipments > 0 ? totalCost / totalShipments : 0;
    
    const onTimeShipments = shipments.filter(shipment => shipment.status === 'on-time').length;
    const onTimePercentage = totalShipments > 0 ? (onTimeShipments / totalShipments) * 100 : 0;
    
    const delayedCount = shipments.filter(shipment => shipment.status === 'delayed').length;
    
    this.kpis = {
      id: 1,
      totalShipments,
      avgCost,
      onTimePercentage,
      delayedCount,
      updatedAt: new Date()
    };
    
    return this.kpis;
  }
  
  // Shipment trend methods
  async getShipmentTrends(): Promise<ShipmentTrend[]> {
    return this.shipmentTrends;
  }
  
  private async createShipmentTrend(trend: InsertShipmentTrend): Promise<ShipmentTrend> {
    const id = this.shipmentTrendId++;
    const newTrend: ShipmentTrend = { ...trend, id };
    this.shipmentTrends.push(newTrend);
    return newTrend;
  }
  
  // Facility methods (combined suppliers, warehouses, stores)
  async getAllFacilities(): Promise<Facility[]> {
    const suppliers = await this.getSuppliers();
    const warehouses = await this.getWarehouses();
    const stores = await this.getStores();
    
    const facilities: Facility[] = [
      ...suppliers.map(s => ({ id: s.id, name: s.name, location: s.location, type: 'supplier' as const })),
      ...warehouses.map(w => ({ id: w.id, name: w.name, location: w.location, type: 'warehouse' as const })),
      ...stores.map(s => ({ id: s.id, name: s.name, location: s.location, type: 'store' as const }))
    ];
    
    return facilities;
  }
}

export const storage = new MemStorage();
