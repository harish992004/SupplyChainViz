import { useQuery } from "@tanstack/react-query";
import { DashboardKPI } from "@shared/schema";

export function useDashboardKPI() {
  return useQuery<DashboardKPI>({
    queryKey: ['/api/dashboard/kpi'],
  });
}
