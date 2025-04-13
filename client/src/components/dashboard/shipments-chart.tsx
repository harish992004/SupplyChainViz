import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardKPI } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface ShipmentsChartProps {
  data: DashboardKPI;
}

type TimeRange = 'daily' | 'monthly' | 'yearly';

const ShipmentsChart = ({ data }: ShipmentsChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  
  return (
    <Card className="bg-secondary rounded-xl shadow-lg border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Shipments Over Time</h3>
          <div className="flex space-x-2">
            <Button
              variant={timeRange === 'daily' ? 'default' : 'secondary'}
              size="sm"
              className={timeRange === 'daily' ? 'bg-accent text-white' : 'bg-gray-700 hover:bg-gray-600'}
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </Button>
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'secondary'}
              size="sm"
              className={timeRange === 'monthly' ? 'bg-accent text-white' : 'bg-gray-700 hover:bg-gray-600'}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={timeRange === 'yearly' ? 'default' : 'secondary'}
              size="sm"
              className={timeRange === 'yearly' ? 'bg-accent text-white' : 'bg-gray-700 hover:bg-gray-600'}
              onClick={() => setTimeRange('yearly')}
            >
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.shipmentsOverTime}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#9CA3AF' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                domain={[40, 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  borderColor: '#4B5563', 
                  color: '#F9FAFB' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#14B8A6" 
                strokeWidth={2}
                dot={{ fill: '#14B8A6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Shipments"
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentsChart;
