import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shipment, Supplier, ShipmentStatus } from "@shared/schema";
import { Printer, Map, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ShipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  suppliers: Supplier[];
}

const ShipmentDetailsModal = ({ isOpen, onClose, shipment, suppliers }: ShipmentDetailsModalProps) => {
  if (!shipment) return null;

  const sourceSupplier = suppliers.find(s => s.id === shipment.sourceId);
  const destSupplier = suppliers.find(s => s.id === shipment.destinationId);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case ShipmentStatus.DELIVERED:
        return <Badge className="bg-green-500 hover:bg-green-600">On Time</Badge>;
      case ShipmentStatus.IN_TRANSIT:
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Transit</Badge>;
      case ShipmentStatus.DELAYED:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Delayed</Badge>;
      case ShipmentStatus.CRITICAL:
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case ShipmentStatus.PENDING:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center justify-between">
            Shipment Details
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h4 className="text-sm text-muted-foreground">Shipment ID</h4>
              <p className="font-mono">{shipment.shipmentId}</p>
            </div>
            <div className="text-right">
              <h4 className="text-sm text-muted-foreground">Status</h4>
              {getStatusBadge(shipment.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground">Origin</h4>
              <p>{sourceSupplier?.name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">
                {sourceSupplier?.city}{sourceSupplier?.country ? `, ${sourceSupplier.country}` : ''}
              </p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">Destination</h4>
              <p>{destSupplier?.name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">
                {destSupplier?.city}{destSupplier?.country ? `, ${destSupplier.country}` : ''}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground">Departure</h4>
              <p>{formatDate(shipment.departureDate)}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">ETA</h4>
              <p>{formatDate(shipment.eta)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">Route</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="relative mr-4">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <div className="absolute top-4 left-1.5 w-1 h-10 bg-border"></div>
                </div>
                <div>
                  <p className="font-medium">{sourceSupplier?.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(shipment.departureDate)}, {formatTime(shipment.departureDate)}
                  </p>
                </div>
              </div>
              
              {shipment.status === ShipmentStatus.IN_TRANSIT && (
                <div className="flex items-start">
                  <div className="relative mr-4">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="absolute top-4 left-1.5 w-1 h-10 bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">In Transit</p>
                    <p className="text-muted-foreground text-sm">Current Location</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="relative mr-4">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                </div>
                <div>
                  <p className="font-medium">{destSupplier?.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(shipment.eta)}, {formatTime(shipment.eta)} (Estimated)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">Costs</h4>
            <div className="bg-background p-3 rounded-lg">
              <div className="flex justify-between">
                <span>Transport Fee</span>
                <span className="font-mono">${(shipment.cost * 0.6).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customs</span>
                <span className="font-mono">${(shipment.cost * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Handling</span>
                <span className="font-mono">${(shipment.cost * 0.2).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-mono font-medium">${shipment.cost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button className="w-full sm:w-auto">
            <Map className="mr-2 h-4 w-4" />
            Track Shipment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentDetailsModal;
