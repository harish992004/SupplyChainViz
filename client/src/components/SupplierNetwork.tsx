import { Chart } from "@/components/ui/chart";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Facility } from "@shared/schema";

interface SupplierNetworkProps {
  facilities: Facility[];
}

export default function SupplierNetwork({ facilities }: SupplierNetworkProps) {
  // Transform facilities into chart data
  const data = facilities.map((facility, index) => {
    // Create randomized position for visualization purposes
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    const z = 10 + Math.random() * 15;
    
    return {
      x,
      y,
      z,
      name: facility.name,
      id: facility.id,
    };
  });

  // Add a central node for manufacturing
  const centralNode = {
    x: 50,
    y: 50,
    z: 25,
    name: "Manufacturing",
    id: 0,
  };

  return (
    <Chart>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="position" 
            tick={false} 
            axisLine={false} 
            label={false} 
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="position" 
            tick={false} 
            axisLine={false} 
            label={false} 
          />
          <ZAxis
            type="number"
            dataKey="z"
            range={[100, 500]}
            name="size"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
            wrapperStyle={{ zIndex: 100 }}
            formatter={(value, name) => {
              if (name === 'position') return '';
              if (name === 'size') return '';
              return value;
            }}
          />
          <Scatter 
            name="Suppliers" 
            data={data} 
            fill="hsl(var(--chart-2))" 
          />
          <Scatter 
            name="Manufacturing" 
            data={[centralNode]} 
            fill="hsl(var(--chart-1))" 
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Chart>
  );
}
