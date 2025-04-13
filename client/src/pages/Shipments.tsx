import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shipment, Supplier, ShipmentStatus } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, Loader2 } from 'lucide-react';
import AddShipmentModal from '@/components/modals/AddShipmentModal';
import ShipmentDetailsModal from '@/components/modals/ShipmentDetailsModal';

const Shipments = () => {
  const [isAddShipmentOpen, setIsAddShipmentOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: shipments = [], isLoading: isShipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });
  
  const { data: suppliers = [], isLoading: isSuppliersLoading } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  const isLoading = isShipmentsLoading || isSuppliersLoading;

  // Filter shipments based on search term and status
  const filteredShipments = shipments.filter(shipment => {
    const sourceSupplier = suppliers.find(s => s.id === shipment.sourceId);
    const destSupplier = suppliers.find(s => s.id === shipment.destinationId);
    
    const searchMatch = 
      shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sourceSupplier && sourceSupplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (destSupplier && destSupplier.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const statusMatch = statusFilter === 'all' || shipment.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Get supplier name by ID
  const getSupplierName = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Unknown';
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Shipments</h2>
          <p className="text-muted-foreground mt-1">Track and manage all your shipments</p>
        </div>
        <Button onClick={() => setIsAddShipmentOpen(true)} className="mt-4 md:mt-0">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Shipment
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle>Shipment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total</div>
              <div className="text-3xl font-bold">{shipments.length}</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">In Transit</div>
              <div className="text-3xl font-bold text-blue-500">
                {shipments.filter(s => s.status === ShipmentStatus.IN_TRANSIT).length}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">On Time</div>
              <div className="text-3xl font-bold text-green-500">
                {shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">Delayed</div>
              <div className="text-3xl font-bold text-yellow-500">
                {shipments.filter(s => s.status === ShipmentStatus.DELAYED).length}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">Critical</div>
              <div className="text-3xl font-bold text-red-500">
                {shipments.filter(s => s.status === ShipmentStatus.CRITICAL).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>All Shipments</CardTitle>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search shipments..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={ShipmentStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ShipmentStatus.IN_TRANSIT}>In Transit</SelectItem>
                    <SelectItem value={ShipmentStatus.DELIVERED}>On Time</SelectItem>
                    <SelectItem value={ShipmentStatus.DELAYED}>Delayed</SelectItem>
                    <SelectItem value={ShipmentStatus.CRITICAL}>Critical</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No shipments found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map(shipment => (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedShipment(shipment)}>
                    <TableCell className="font-mono">{shipment.shipmentId}</TableCell>
                    <TableCell>{shipment.productName}</TableCell>
                    <TableCell>{getSupplierName(shipment.sourceId)}</TableCell>
                    <TableCell>{getSupplierName(shipment.destinationId)}</TableCell>
                    <TableCell>{formatDate(shipment.departureDate)}</TableCell>
                    <TableCell>{formatDate(shipment.eta)}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell className="font-mono">${shipment.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShipment(shipment);
                      }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddShipmentModal
        isOpen={isAddShipmentOpen}
        onClose={() => setIsAddShipmentOpen(false)}
        suppliers={suppliers}
      />

      <ShipmentDetailsModal
        shipment={selectedShipment}
        isOpen={selectedShipment !== null}
        onClose={() => setSelectedShipment(null)}
        suppliers={suppliers}
      />
    </div>
  );
};

export default Shipments;
