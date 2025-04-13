import { useQuery } from "@tanstack/react-query";
import { Supplier } from "@shared/schema";

export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });
}
