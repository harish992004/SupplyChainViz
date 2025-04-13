import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shipment } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ShipmentModal from "./ShipmentModal";

interface ShipmentTableProps {
  shipments: Shipment[];
  isLoading: boolean;
}

export default function ShipmentTable({ shipments, isLoading }: ShipmentTableProps) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Format shipment status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-yellow-100 text-yellow-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status label
  const formatStatusLabel = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate pagination
  const totalPages = Math.ceil(shipments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shipments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Handle row click
  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b border-gray-700 flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-medium text-white">Recent Shipments</CardTitle>
          <Button variant="link" className="text-accent p-0">View All</Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-b border-gray-700">
                      <TableCell colSpan={7} className="p-2">
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : shipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No shipments found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((shipment) => (
                    <TableRow 
                      key={shipment.id} 
                      className="border-b border-gray-700 cursor-pointer hover:bg-muted/30"
                      onClick={() => handleRowClick(shipment)}
                    >
                      <TableCell className="font-medium">{shipment.shipmentId}</TableCell>
                      <TableCell>{shipment.product}</TableCell>
                      <TableCell>
                        {`${shipment.source.lat.toFixed(1)}, ${shipment.source.lng.toFixed(1)}`}
                      </TableCell>
                      <TableCell>
                        {`${shipment.destination.lat.toFixed(1)}, ${shipment.destination.lng.toFixed(1)}`}
                      </TableCell>
                      <TableCell>{new Date(shipment.eta).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(shipment.status)}`}>
                          {formatStatusLabel(shipment.status)}
                        </span>
                      </TableCell>
                      <TableCell>${shipment.cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-700 flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, shipments.length)} of {shipments.length} shipments
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button 
              size="sm" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {selectedShipment && (
        <ShipmentModal
          shipment={selectedShipment}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
