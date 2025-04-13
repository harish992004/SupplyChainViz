import { useRef, useEffect } from 'react';
import { Supplier } from '@shared/schema';

interface NetworkGraphProps {
  suppliers: Supplier[];
  width?: number;
  height?: number;
}

const NetworkGraph = ({ suppliers, width = 300, height = 300 }: NetworkGraphProps) => {
  // Filter suppliers by type
  const manufacturingNodes = suppliers.filter(s => s.type === 'warehouse').slice(0, 1);
  const supplierNodes = suppliers.filter(s => s.type === 'supplier').slice(0, 5);
  
  // Central node is the first warehouse
  const centralNode = manufacturingNodes.length > 0 
    ? manufacturingNodes[0] 
    : { id: 0, name: 'Manufacturing' };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {/* Central Node */}
      <circle cx={width/2} cy={height/2} r="25" fill="#14B8A6" />
      <text 
        x={width/2} 
        y={height/2 + 5} 
        textAnchor="middle" 
        fill="white" 
        fontSize="10"
      >
        Manufacturing
      </text>
      
      {/* Supplier Nodes */}
      {supplierNodes.map((supplier, index) => {
        // Calculate position in a circle around the central node
        const angle = (index * (2 * Math.PI / supplierNodes.length));
        const radius = 90;
        const x = width/2 + radius * Math.cos(angle);
        const y = height/2 + radius * Math.sin(angle);
        
        return (
          <g key={supplier.id}>
            <circle cx={x} cy={y} r="20" fill="#60A5FA" />
            <text 
              x={x} 
              y={y + 5} 
              textAnchor="middle" 
              fill="white" 
              fontSize="10"
            >
              {supplier.name.includes(' ') 
                ? supplier.name.split(' ')[0] 
                : supplier.name}
            </text>
            
            {/* Connection line to central node */}
            <line 
              x1={width/2} 
              y1={height/2} 
              x2={x} 
              y2={y} 
              stroke="white" 
              strokeWidth="2" 
              opacity="0.5" 
            />
          </g>
        );
      })}
    </svg>
  );
};

export default NetworkGraph;
