import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shipment, ShipmentStatus } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentShipmentsProps {
  shipments: Shipment[];
  onShipmentClick: (shipmentId: number) => void;
}

const RecentShipments = ({ shipments, onShipmentClick }: RecentShipmentsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const filteredShipments = shipments
    .filter(shipment => 
      shipment.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, startIndex + itemsPerPage);
  
  const getStatusBadgeStyles = (status: string) => {
    switch(status) {
      case ShipmentStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case ShipmentStatus.IN_TRANSIT:
        return 'bg-yellow-100 text-yellow-800';
      case ShipmentStatus.DELAYED:
        return 'bg-red-100 text-red-800';
      case ShipmentStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  return (
    <Card className="bg-secondary rounded-xl shadow-lg border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Recent Shipments</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search shipments..."
                className="bg-gray-700 text-white text-sm rounded-lg pl-8 pr-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600">
              <Filter className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">ID</TableHead>
                <TableHead className="text-gray-400">Source</TableHead>
                <TableHead className="text-gray-400">Destination</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">ETA</TableHead>
                <TableHead className="text-gray-400">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedShipments.map((shipment) => (
                <TableRow 
                  key={shipment.id}
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => onShipmentClick(shipment.id)}
                >
                  <TableCell>#{shipment.productId}</TableCell>
                  <TableCell>{shipment.source}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      getStatusBadgeStyles(shipment.status)
                    )}>
                      {formatStatusLabel(shipment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(shipment.eta), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>${shipment.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium">{startIndex + 1}</span> to {' '}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredShipments.length)}
            </span> of {' '}
            <span className="font-medium">{filteredShipments.length}</span> shipments
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="bg-gray-700 text-gray-300 hover:bg-gray-600" 
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              Previous
            </Button>
            <Button 
              className="bg-accent text-white hover:bg-teal-600" 
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentShipments;
