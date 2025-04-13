import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplierNetworkProps {
  isLarge?: boolean;
}

// A component that renders a network visualization of suppliers
const SupplierNetwork = ({ isLarge = false }: SupplierNetworkProps) => {
  const renderGraph = () => {
    if (isLarge) {
      // Larger network visualization
      return (
        <svg width="300" height="300" className="mx-auto">
          {/* Manufacturing hub (center) */}
          <circle cx="150" cy="150" r="35" fill="#38B2AC" />
          <text x="125" y="155" fill="#F7FAFC" fontSize="14">Manufacturing</text>

          {/* Supplier nodes */}
          <circle cx="80" cy="80" r="20" fill="#4299E1" />
          <circle cx="220" cy="80" r="20" fill="#4299E1" />
          <circle cx="220" cy="220" r="20" fill="#4299E1" />
          <circle cx="80" cy="220" r="20" fill="#4299E1" />
          <circle cx="70" cy="150" r="20" fill="#4299E1" />

          {/* Connection lines */}
          <line x1="150" y1="150" x2="80" y2="80" stroke="#2D3748" strokeWidth="2" />
          <line x1="150" y1="150" x2="220" y2="80" stroke="#2D3748" strokeWidth="2" />
          <line x1="150" y1="150" x2="220" y2="220" stroke="#2D3748" strokeWidth="2" />
          <line x1="150" y1="150" x2="80" y2="220" stroke="#2D3748" strokeWidth="2" />
          <line x1="150" y1="150" x2="70" y2="150" stroke="#2D3748" strokeWidth="2" />

          {/* Labels */}
          <text x="75" y="75" fill="#A0AEC0" fontSize="12">Supplier A</text>
          <text x="215" y="75" fill="#A0AEC0" fontSize="12">Supplier B</text>
          <text x="215" y="235" fill="#A0AEC0" fontSize="12">Supplier C</text>
          <text x="75" y="235" fill="#A0AEC0" fontSize="12">Supplier D</text>
          <text x="40" y="155" fill="#A0AEC0" fontSize="12">Supplier E</text>
        </svg>
      );
    }

    // Default smaller network visualization
    return (
      <svg width="240" height="200" className="mx-auto">
        {/* Manufacturing hub (center) */}
        <circle cx="120" cy="100" r="25" fill="#38B2AC" />
        
        {/* Supplier nodes */}
        <circle cx="50" cy="70" r="15" fill="#4299E1" />
        <circle cx="60" cy="150" r="15" fill="#4299E1" />
        <circle cx="180" cy="70" r="15" fill="#4299E1" />
        <circle cx="190" cy="150" r="15" fill="#4299E1" />
        
        {/* Connection lines */}
        <line x1="120" y1="100" x2="50" y2="70" stroke="#2D3748" strokeWidth="2" />
        <line x1="120" y1="100" x2="60" y2="150" stroke="#2D3748" strokeWidth="2" />
        <line x1="120" y1="100" x2="180" y2="70" stroke="#2D3748" strokeWidth="2" />
        <line x1="120" y1="100" x2="190" y2="150" stroke="#2D3748" strokeWidth="2" />
        
        {/* Labels */}
        <text x="50" y="60" fill="#A0AEC0" fontSize="12">Supplier A</text>
        <text x="60" y="170" fill="#A0AEC0" fontSize="12">Supplier D</text>
        <text x="180" y="60" fill="#A0AEC0" fontSize="12">Supplier B</text>
        <text x="190" y="170" fill="#A0AEC0" fontSize="12">Supplier E</text>
        <text x="100" y="105" fill="#F7FAFC" fontSize="12">Manufacturing</text>
      </svg>
    );
  };

  return (
    <Card>
      <CardHeader className="border-b border-border flex justify-between items-center">
        <CardTitle>Suppliers</CardTitle>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-center">
          {renderGraph()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierNetwork;
