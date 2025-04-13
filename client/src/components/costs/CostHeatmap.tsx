import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// A component that renders a visualization of costs across regions
const CostHeatmap = () => {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Cost Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* SVG map of Europe with heat overlay */}
        <svg width="100%" height="300" viewBox="0 0 800 600" className="mx-auto">
          {/* Simplified Europe map outline */}
          <path
            d="M400,100 Q500,120 550,200 T650,350 Q660,400 580,450 T450,500 Q350,520 250,480 T150,350 Q140,250 200,180 T400,100"
            fill="#1a2e44"
            stroke="#334155"
            strokeWidth="2"
          />
          
          {/* Heat overlay areas with gradient */}
          <path
            d="M300,150 Q380,160 420,220 T460,300 Q420,350 350,320 T280,230 Q275,180 300,150"
            fill="#f44336"
            opacity="0.3"
          />
          
          <path
            d="M500,250 Q550,280 540,350 T480,420 Q420,430 390,370 T420,280 Q460,260 500,250"
            fill="#ff9800"
            opacity="0.3"
          />
          
          <path
            d="M250,320 Q300,340 310,400 T270,480 Q220,490 190,430 T220,340 Q230,330 250,320"
            fill="#ffeb3b"
            opacity="0.3"
          />
          
          {/* Major cities/points */}
          <circle cx="350" cy="180" r="5" fill="#4299E1" />
          <text x="360" y="185" fontSize="12" fill="#A0AEC0">Stockholm</text>
          
          <circle cx="330" cy="250" r="5" fill="#4299E1" />
          <text x="340" y="255" fontSize="12" fill="#A0AEC0">Berlin</text>
          
          <circle cx="230" cy="230" r="5" fill="#4299E1" />
          <text x="240" y="235" fontSize="12" fill="#A0AEC0">London</text>
          
          <circle cx="280" cy="290" r="5" fill="#4299E1" />
          <text x="290" y="295" fontSize="12" fill="#A0AEC0">Paris</text>
          
          <circle cx="350" cy="350" r="5" fill="#4299E1" />
          <text x="360" y="355" fontSize="12" fill="#A0AEC0">Rome</text>
          
          <circle cx="450" cy="300" r="5" fill="#4299E1" />
          <text x="460" y="305" fontSize="12" fill="#A0AEC0">Warsaw</text>
          
          <circle cx="550" cy="270" r="5" fill="#4299E1" />
          <text x="560" y="275" fontSize="12" fill="#A0AEC0">Moscow</text>
          
          {/* Legend */}
          <rect x="50" y="520" width="20" height="10" fill="#f44336" opacity="0.3" />
          <text x="80" y="530" fontSize="12" fill="#A0AEC0">High Cost</text>
          
          <rect x="50" y="540" width="20" height="10" fill="#ff9800" opacity="0.3" />
          <text x="80" y="550" fontSize="12" fill="#A0AEC0">Medium Cost</text>
          
          <rect x="50" y="560" width="20" height="10" fill="#ffeb3b" opacity="0.3" />
          <text x="80" y="570" fontSize="12" fill="#A0AEC0">Low Cost</text>
        </svg>
      </CardContent>
    </Card>
  );
};

export default CostHeatmap;
