import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Filter, Plus } from "lucide-react";
import SupplierMap from "@/components/SupplierMap";
import KPICard from "@/components/KPICard";
import ShipmentChart from "@/components/ShipmentChart";
import SupplierNetwork from "@/components/SupplierNetwork";
import CostHeatmap from "@/components/CostHeatmap";
import ShipmentTable from "@/components/ShipmentTable";
import { useLocation } from "wouter";
import { KPI, Shipment, ShipmentTrend, Facility } from "@shared/schema";

export default function MapView() {
  const [_, setLocation] = useLocation();

  // Fetch KPI metrics
  const { data: kpiData, isLoading: kpiLoading } = useQuery<KPI>({
    queryKey: ['/api/dashboard/kpi'],
  });

  // Fetch shipments
  const { data: shipments, isLoading: shipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  // Fetch facilities (suppliers, warehouses, stores)
  const { data: facilities, isLoading: facilitiesLoading } = useQuery<Facility[]>({
    queryKey: ['/api/facilities'],
  });

  // Fetch shipment trends
  const { data: shipmentTrends, isLoading: trendsLoading } = useQuery<ShipmentTrend[]>({
    queryKey: ['/api/dashboard/shipment-trends'],
  });

  const handleAddShipment = () => {
    setLocation("/add-shipment");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Supply Chain Map</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={handleAddShipment}>
            <Plus className="mr-2 h-4 w-4" /> Add Shipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Card */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="map-container">
            {facilitiesLoading || shipmentsLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <SupplierMap facilities={facilities || []} shipments={shipments || []} />
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-700">
            <div className="flex flex-wrap items-center text-sm">
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 rounded-full bg-accent mr-2"></span>
                <span className="text-gray-300">Supplier</span>
              </div>
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-gray-300">Warehouse</span>
              </div>
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                <span className="text-gray-300">Store</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-0.5 bg-accent mr-2"></span>
                <span className="text-gray-300">In-process shipment</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="space-y-6">
          <Card>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Key Metrics</h2>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {kpiLoading ? (
                  <>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </>
                ) : (
                  <>
                    <KPICard 
                      title="Total Shipments" 
                      value={kpiData?.totalShipments.toString() || "0"} 
                    />
                    <KPICard 
                      title="Average Cost per Shipment" 
                      value={`$${kpiData?.avgCost.toFixed(2) || "0.00"}`} 
                    />
                    <KPICard 
                      title="On Time Deliveries" 
                      value={`${Math.round(kpiData?.onTimePercentage || 0)}%`} 
                      valueClassName="text-green-500"
                    />
                    <KPICard 
                      title="Delayed Shipments" 
                      value={kpiData?.delayedCount.toString() || "0"} 
                      valueClassName="text-red-500"
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipment Trends Chart */}
          <Card>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Shipments Over Time</h2>
            </div>
            <CardContent className="p-4">
              {trendsLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ShipmentChart data={shipmentTrends || []} />
              )}
            </CardContent>
          </Card>

          {/* Supplier Network Visualization */}
          <Card>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">Suppliers</h2>
            </div>
            <CardContent className="p-4">
              {facilitiesLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <SupplierNetwork facilities={facilities?.filter(f => f.type === 'supplier') || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Cost Heatmap */}
        <Card>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Cost Heatmap</h2>
            <select className="bg-secondary border border-gray-600 rounded px-2 py-1 text-white text-sm">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <CardContent className="p-4">
            <CostHeatmap />
          </CardContent>
        </Card>

        {/* Supplier Network */}
        <Card>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Supplier Network</h2>
            <Button variant="link" className="text-accent hover:text-accent p-0">
              View Full
            </Button>
          </div>
          <CardContent className="p-4 flex justify-center">
            <div className="relative w-full h-48">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-xs">
                  Manufacturing
                </div>
                
                {/* Supplier A */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mb-1">
                    <span>A</span>
                  </div>
                  <span className="text-xs text-gray-300">Supplier A</span>
                </div>
                
                {/* Supplier B */}
                <div className="absolute top-1/2 right-0 transform translate-x-6 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mb-1">
                    <span>B</span>
                  </div>
                  <span className="text-xs text-gray-300">Supplier B</span>
                </div>
                
                {/* Supplier D */}
                <div className="absolute bottom-0 left-0 transform -translate-x-6 translate-y-6 flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mb-1">
                    <span>D</span>
                  </div>
                  <span className="text-xs text-gray-300">Supplier D</span>
                </div>
                
                {/* SVG Lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Center to Supplier A */}
                  <line x1="50%" y1="50%" x2="50%" y2="0" stroke="hsl(var(--accent))" strokeWidth="2"></line>
                  
                  {/* Center to Supplier B */}
                  <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--accent))" strokeWidth="2"></line>
                  
                  {/* Center to Supplier D */}
                  <line x1="50%" y1="50%" x2="0" y2="100%" stroke="hsl(var(--accent))" strokeWidth="2"></line>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments Table */}
      <div className="mt-6">
        <ShipmentTable shipments={shipments || []} isLoading={shipmentsLoading} />
      </div>
    </div>
  );
}
