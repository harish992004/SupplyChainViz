import { useQuery } from '@tanstack/react-query';
import { ShipmentsByMonth } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const ShipmentsOverTime = () => {
  const { data: shipmentsOverTime, isLoading } = useQuery<ShipmentsByMonth[]>({
    queryKey: ['/api/dashboard/shipments-over-time'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipments Over Time</CardTitle>
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
        <CardTitle>Shipments Over Time</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shipmentsOverTime}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#A0AEC0' }}
                stroke="#2D3748"
                tickLine={{ stroke: '#2D3748' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#A0AEC0' }} 
                stroke="#2D3748"
                tickLine={{ stroke: '#2D3748' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: '1px solid #2D3748',
                  borderRadius: '4px',
                  color: '#F7FAFC'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#38B2AC" 
                strokeWidth={2}
                fill="rgba(56, 178, 172, 0.1)"
                activeDot={{ r: 6, fill: '#38B2AC' }}
                dot={{ r: 3, fill: '#38B2AC' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentsOverTime;
