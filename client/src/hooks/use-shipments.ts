import { useQuery } from "@tanstack/react-query";
import { Shipment } from "@shared/schema";

export function useShipments() {
  return useQuery<Shipment[]>({
    queryKey: ['/api/shipments'],
  });
}
