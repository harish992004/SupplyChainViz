import { useQuery } from '@tanstack/react-query';
import { DashboardKPI } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const KeyMetrics = () => {
  const { data: kpi, isLoading } = useQuery<DashboardKPI>({
    queryKey: ['/api/dashboard/kpi'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Total Shipments</h4>
            <p className="text-3xl font-bold font-mono">{kpi?.totalShipments}</p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Average Cost per Shipment</h4>
            <p className="text-3xl font-bold font-mono">
              ${kpi?.averageCostPerShipment.toFixed(2)}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">On Time Deliveries</h4>
            <p className="text-3xl font-bold font-mono text-green-500">
              {kpi?.onTimePercentage.toFixed(0)}%
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Delayed Shipments</h4>
            <p className="text-3xl font-bold font-mono text-yellow-500">
              {kpi?.delayedShipments}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyMetrics;
