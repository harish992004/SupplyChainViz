import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Map from '@/components/ui/map';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useShipments } from '@/hooks/use-shipments';
import { locationType } from '@shared/schema';

export default function MapView() {
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();
  const { data: shipments = [], isLoading: shipmentsLoading } = useShipments();
  const [highlightedShipmentId, setHighlightedShipmentId] = useState<number | null>(null);
  
  // Look for shipment ID in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shipmentId = params.get('shipment');
    if (shipmentId) {
      const id = parseInt(shipmentId, 10);
      if (!isNaN(id)) {
        setHighlightedShipmentId(id);
        // Can also show details modal for this shipment
        const event = new CustomEvent('openShipmentDetailsModal', { detail: id });
        window.dispatchEvent(event);
      }
    }
  }, []);
  
  const handleRouteClick = (shipmentId: number) => {
    setHighlightedShipmentId(shipmentId);
    const event = new CustomEvent('openShipmentDetailsModal', { detail: shipmentId });
    window.dispatchEvent(event);
  };
  
  if (suppliersLoading || shipmentsLoading) {
    return (
      <div>
        <Header title="Map View" />
        <main className="p-6">
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="Map View" />
      <main className="p-6">
        <div className="bg-secondary rounded-xl overflow-hidden shadow-lg mb-6">
          <div className="h-[500px]">
            <Map 
              suppliers={suppliers} 
              onRouteClick={handleRouteClick} 
              highlightedShipmentId={highlightedShipmentId}
            />
          </div>
          <div className="p-4 bg-secondary border-t border-gray-700 flex flex-wrap gap-4">
            <div className="flex items-center mr-4">
              <div className="h-3 w-3 rounded-full bg-accent mr-2"></div>
              <span className="text-sm text-gray-300">Supplier</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="h-3 w-3 rounded-full bg-highlight mr-2"></div>
              <span className="text-sm text-gray-300">Warehouse</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-300">Store</span>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-10 bg-white rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">In-process shipment</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
