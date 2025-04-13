import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Shipment, Supplier, ShipmentStatus } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import ShipmentDetailsModal from '@/components/modals/ShipmentDetailsModal';

const RecentShipments = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const { data: shipments = [], isLoading: isShipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  const { data: suppliers = [], isLoading: isSuppliersLoading } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  const isLoading = isShipmentsLoading || isSuppliersLoading;

  // Get the 5 most recent shipments
  const recentShipments = [...shipments]
    .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime())
    .slice(0, 4);

  // Get supplier name by ID
  const getSupplierName = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Unknown';
  };

  // Get badge color based on shipment status
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

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b border-border flex justify-between items-center">
          <CardTitle>Recent Shipments</CardTitle>
          <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
            View All
          </Button>
        </CardHeader>
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-background/50">
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No shipments found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentShipments.map(shipment => (
                    <TableRow 
                      key={shipment.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedShipment(shipment)}
                    >
                      <TableCell className="font-mono">{shipment.shipmentId}</TableCell>
                      <TableCell>{getSupplierName(shipment.sourceId)}</TableCell>
                      <TableCell>{getSupplierName(shipment.destinationId)}</TableCell>
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                      <TableCell>{formatDate(shipment.eta)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <ShipmentDetailsModal
        shipment={selectedShipment}
        isOpen={selectedShipment !== null}
        onClose={() => setSelectedShipment(null)}
        suppliers={suppliers}
      />
    </>
  );
};

export default RecentShipments;
