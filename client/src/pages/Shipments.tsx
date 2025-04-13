import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ShipmentTable from "@/components/ShipmentTable";
import { Shipment } from "@shared/schema";
import { useLocation } from "wouter";

export default function Shipments() {
  const [_, setLocation] = useLocation();

  // Fetch shipments
  const { data: shipments, isLoading } = useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });

  const handleAddShipment = () => {
    setLocation("/add-shipment");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Shipments</h1>
        <Button onClick={handleAddShipment}>
          <Plus className="mr-2 h-4 w-4" /> Add Shipment
        </Button>
      </div>

      <ShipmentTable shipments={shipments || []} isLoading={isLoading} />
    </div>
  );
}
