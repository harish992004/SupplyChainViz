import KPICard from './kpi-card';
import { Package, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { DashboardKPI } from '@shared/schema';

interface KPISectionProps {
  data: DashboardKPI;
}

const KPISection = ({ data }: KPISectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KPICard
        title="Total Shipments"
        value={data.totalShipments.toLocaleString()}
        icon={<Package />}
        change={{
          value: 12,
          isPositive: true
        }}
      />
      
      <KPICard
        title="Average Cost per Shipment"
        value={`$${data.avgCost.toFixed(2)}`}
        icon={<DollarSign />}
        change={{
          value: 3,
          isPositive: false
        }}
      />
      
      <KPICard
        title="On-Time Deliveries"
        value={`${Math.round(data.onTimePercentage)}%`}
        icon={<Clock />}
        change={{
          value: 4,
          isPositive: true
        }}
      />
      
      <KPICard
        title="Delayed Shipments"
        value={data.delayedShipments}
        icon={<AlertTriangle />}
        change={{
          value: 8,
          isPositive: false
        }}
      />
    </div>
  );
};

export default KPISection;
