import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, CheckCircle, Clock, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShipments } from "@/hooks/use-shipments";
import { format } from "date-fns";
import { ShipmentStatus } from "@shared/schema";
import { cn } from "@/lib/utils";

export function ShipmentDetailsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const { data: shipments = [] } = useShipments();
  
  const selectedShipment = shipments.find(s => s.id === selectedShipmentId);

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === 'number') {
        setSelectedShipmentId(event.detail);
        setIsOpen(true);
      }
    };
    
    window.addEventListener("openShipmentDetailsModal", handleOpenModal as EventListener);
    
    return () => {
      window.removeEventListener("openShipmentDetailsModal", handleOpenModal as EventListener);
    };
  }, []);

  const getStatusBadgeStyles = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status) {
      case ShipmentStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case ShipmentStatus.IN_TRANSIT:
        return "bg-yellow-100 text-yellow-800";
      case ShipmentStatus.DELAYED:
        return "bg-red-100 text-red-800";
      case ShipmentStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatStatusLabel = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  if (!selectedShipment) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-secondary rounded-xl max-w-lg p-6 shadow-xl border-gray-700">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Shipment #{selectedShipment.productId}
          </DialogTitle>
          <button 
            className="text-gray-400 hover:text-white" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Status:</span>
            <Badge className={cn(
              "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
              getStatusBadgeStyles(selectedShipment.status)
            )}>
              {formatStatusLabel(selectedShipment.status)}
            </Badge>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Source:</span>
            <span>{selectedShipment.source}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Destination:</span>
            <span>{selectedShipment.destination}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Expected Delivery:</span>
            <span>{format(new Date(selectedShipment.eta), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Distance:</span>
            <span>{Math.floor(Math.random() * 500) + 300} km</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Cost:</span>
            <span>${selectedShipment.cost.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-3">Shipment Progress</h4>
          <div className="relative">
            <div className="absolute top-5 left-5 h-full w-0.5 bg-gray-700"></div>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 z-10">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="font-medium">Processing Complete</h5>
                  <p className="text-sm text-gray-400">
                    {format(new Date(selectedShipment.createdAt), 'MMM dd, yyyy - hh:mm a')}
                  </p>
                </div>
              </div>
              
              {(selectedShipment.status === ShipmentStatus.IN_TRANSIT || 
                selectedShipment.status === ShipmentStatus.DELIVERED || 
                selectedShipment.status === ShipmentStatus.DELAYED) && (
                <div className="flex">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h5 className="font-medium">Departed {selectedShipment.source}</h5>
                    <p className="text-sm text-gray-400">
                      {format(
                        new Date(new Date(selectedShipment.createdAt).getTime() + 86400000), 
                        'MMM dd, yyyy - hh:mm a'
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedShipment.status === ShipmentStatus.IN_TRANSIT && (
                <div className="flex">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-10 w-10 rounded-full bg-highlight flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h5 className="font-medium">In Transit</h5>
                    <p className="text-sm text-gray-400">Current Location: On route to {selectedShipment.destination}</p>
                  </div>
                </div>
              )}
              
              {selectedShipment.status === ShipmentStatus.DELAYED && (
                <div className="flex">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h5 className="font-medium">Delayed</h5>
                    <p className="text-sm text-gray-400">Shipment is delayed. New ETA being calculated.</p>
                  </div>
                </div>
              )}
              
              {selectedShipment.status === ShipmentStatus.DELIVERED && (
                <div className="flex">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h5 className="font-medium">Delivered</h5>
                    <p className="text-sm text-gray-400">
                      {selectedShipment.actualTime ? 
                        format(new Date(selectedShipment.actualTime), 'MMM dd, yyyy - hh:mm a') :
                        "Delivery confirmed"
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {selectedShipment.status !== ShipmentStatus.DELIVERED && (
                <div className="flex">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <Flag className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h5 className="font-medium text-gray-400">Arrival at {selectedShipment.destination}</h5>
                    <p className="text-sm text-gray-500">
                      Expected: {format(new Date(selectedShipment.eta), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline"
            className="bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => {
              // Generate a download of shipment details
              const shipmentData = JSON.stringify(selectedShipment, null, 2);
              const blob = new Blob([shipmentData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `shipment-${selectedShipment.id}-details.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download Details
          </Button>
          <Button 
            className="bg-accent text-white hover:bg-teal-600"
            onClick={() => {
              setIsOpen(false);
              // Use wouter navigation approach for routing
              // Navigate to map and also set current shipment ID in URL
              window.location.href = `/map?shipment=${selectedShipment.id}`;
            }}
          >
            Track on Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
