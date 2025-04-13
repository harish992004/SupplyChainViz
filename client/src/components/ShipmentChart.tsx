import { Chart } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShipmentTrend } from "@shared/schema";

interface ShipmentChartProps {
  data: ShipmentTrend[];
  height?: number;
}

export default function ShipmentChart({ data, height = 200 }: ShipmentChartProps) {
  // Sort data by month order
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const sortedData = [...data].sort((a, b) => {
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  return (
    <Chart className={`h-[${height}px]`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: "hsl(var(--muted-foreground))" }} 
            axisLine={{ stroke: "hsl(var(--border))" }} 
          />
          <YAxis 
            tick={{ fill: "hsl(var(--muted-foreground))" }} 
            axisLine={{ stroke: "hsl(var(--border))" }} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Shipments"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Chart>
  );
}
