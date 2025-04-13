import { Card, CardContent } from '@/components/ui/card';

const CostHeatmap = () => {
  return (
    <Card className="bg-secondary rounded-xl shadow-lg border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Cost Heatmap</h3>
          <button className="text-xs text-accent hover:underline">View Details</button>
        </div>
        
        <div className="h-64 relative flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 500 300">
            {/* Europe Map Outline - Simplified SVG */}
            <path 
              d="M250,60 L300,80 L320,120 L350,140 L370,160 L390,170 L410,200 L400,230 L370,250 L340,260 L310,240 L290,200 L260,190 L230,210 L200,230 L170,220 L150,190 L130,160 L120,130 L140,100 L170,80 L200,70 L250,60" 
              fill="#1F2937" 
              stroke="#374151" 
              strokeWidth="2"
            />
            
            {/* Heat Spots */}
            <circle cx="200" cy="100" r="30" fill="rgba(239, 68, 68, 0.4)" />
            <circle cx="300" cy="150" r="35" fill="rgba(239, 68, 68, 0.6)" />
            <circle cx="250" cy="200" r="25" fill="rgba(239, 68, 68, 0.3)" />
            <circle cx="150" cy="150" r="20" fill="rgba(239, 68, 68, 0.2)" />
            <circle cx="350" cy="220" r="15" fill="rgba(239, 68, 68, 0.5)" />
            
            {/* Country Labels - Simplified */}
            <text x="200" y="90" textAnchor="middle" fill="#D1D5DB" fontSize="10">Sweden</text>
            <text x="300" y="140" textAnchor="middle" fill="#D1D5DB" fontSize="10">Poland</text>
            <text x="350" y="180" textAnchor="middle" fill="#D1D5DB" fontSize="10">Ukraine</text>
            <text x="150" y="140" textAnchor="middle" fill="#D1D5DB" fontSize="10">France</text>
            <text x="220" y="220" textAnchor="middle" fill="#D1D5DB" fontSize="10">Italy</text>
            <text x="180" y="180" textAnchor="middle" fill="#D1D5DB" fontSize="10">Spain</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostHeatmap;
