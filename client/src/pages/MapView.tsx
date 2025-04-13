import { useState } from 'react';
import SupplyChainMap from '@/components/map/SupplyChainMap';
import KeyMetrics from '@/components/metrics/KeyMetrics';
import ShipmentsOverTime from '@/components/charts/ShipmentsOverTime';
import SupplierNetwork from '@/components/suppliers/SupplierNetwork';
import CostHeatmap from '@/components/costs/CostHeatmap';
import RecentShipments from '@/components/shipments/RecentShipments';
import ShipmentDetailsModal from '@/components/modals/ShipmentDetailsModal';
import AddShipmentModal from '@/components/modals/AddShipmentModal';
import { useQuery } from '@tanstack/react-query';
import { Shipment, Supplier } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { PlusIcon, DownloadIcon } from 'lucide-react';

const MapView = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isAddShipmentOpen, setIsAddShipmentOpen] = useState(false);

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  const { data: shipments = [] } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  const handleRouteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
  };

  const handleExport = () => {
    // In a real app, this would generate a report
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Supply Chain Map</h2>
          <p className="text-muted-foreground mt-1">Visualize and monitor your global supply chain network</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button onClick={() => setIsAddShipmentOpen(true)} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>Add Shipment</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <SupplyChainMap 
            suppliers={suppliers} 
            shipments={shipments}
            onRouteClick={handleRouteClick}
          />
        </div>

        {/* Metrics Section - Takes 1/3 width on large screens */}
        <div className="space-y-6">
          <KeyMetrics />
          <ShipmentsOverTime />
          <SupplierNetwork />
        </div>
      </div>

      {/* Cost Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CostHeatmap />
        <SupplierNetwork isLarge={true} />
        <RecentShipments />
      </div>

      {/* Modals */}
      <ShipmentDetailsModal 
        shipment={selectedShipment} 
        isOpen={selectedShipment !== null} 
        onClose={() => setSelectedShipment(null)}
        suppliers={suppliers}
      />
      
      <AddShipmentModal 
        isOpen={isAddShipmentOpen}
        onClose={() => setIsAddShipmentOpen(false)}
        suppliers={suppliers}
      />
    </div>
  );
};

export default MapView;
