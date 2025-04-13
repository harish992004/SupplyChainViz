import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KPICard from "@/components/KPICard";
import ShipmentChart from "@/components/ShipmentChart";
import CostHeatmap from "@/components/CostHeatmap";
import { KPI, ShipmentTrend } from "@shared/schema";

export default function KPIDashboard() {
  // Fetch KPI metrics
  const { data: kpiData, isLoading: kpiLoading } = useQuery<KPI>({
    queryKey: ['/api/dashboard/kpi'],
  });

  // Fetch shipment trends
  const { data: shipmentTrends, isLoading: trendsLoading } = useQuery<ShipmentTrend[]>({
    queryKey: ['/api/dashboard/shipment-trends'],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">KPI Dashboard</h1>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
              large
            />
            <KPICard 
              title="Average Cost per Shipment" 
              value={`$${kpiData?.avgCost.toFixed(2) || "0.00"}`} 
              large
            />
            <KPICard 
              title="On Time Deliveries" 
              value={`${Math.round(kpiData?.onTimePercentage || 0)}%`} 
              valueClassName="text-green-500"
              large
            />
            <KPICard 
              title="Delayed Shipments" 
              value={kpiData?.delayedCount.toString() || "0"} 
              valueClassName="text-red-500"
              large
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Trends Chart */}
        <Card>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Shipments Over Time</h2>
          </div>
          <CardContent className="p-4">
            {trendsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ShipmentChart data={shipmentTrends || []} height={300} />
            )}
          </CardContent>
        </Card>

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
            <div className="h-[300px]">
              <CostHeatmap />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Supplier Performance</h2>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Supplier A</span>
                <span className="text-sm text-green-500">98.2%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '98.2%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Supplier B</span>
                <span className="text-sm text-green-500">92.7%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92.7%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Supplier C</span>
                <span className="text-sm text-yellow-500">85.5%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '85.5%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Delivery Times</h2>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Sweden → Germany</span>
                <span className="text-sm text-white">2.3 days</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Poland → France</span>
                <span className="text-sm text-white">3.1 days</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Germany → Spain</span>
                <span className="text-sm text-white">4.5 days</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">Cost Distribution</h2>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Transportation</span>
                <span className="text-sm text-white">$2.15 (48%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: '48%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Handling</span>
                <span className="text-sm text-white">$1.32 (30%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Insurance</span>
                <span className="text-sm text-white">$0.85 (22%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
