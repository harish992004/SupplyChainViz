import { Card, CardContent } from '@/components/ui/card';
import NetworkGraph from '@/components/ui/network-graph';
import { Supplier } from '@shared/schema';

interface SupplierNetworkProps {
  suppliers: Supplier[];
}

const SupplierNetwork = ({ suppliers }: SupplierNetworkProps) => {
  return (
    <Card className="bg-secondary rounded-xl shadow-lg border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Supplier Network</h3>
          <button className="text-xs text-accent hover:underline">View All</button>
        </div>
        
        <div className="h-72 relative">
          <NetworkGraph suppliers={suppliers} width={300} height={300} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierNetwork;
