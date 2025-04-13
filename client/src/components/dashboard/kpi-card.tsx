import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
    text?: string;
  };
}

const KPICard = ({ title, value, icon, change }: KPICardProps) => {
  return (
    <Card className="bg-secondary rounded-xl shadow-lg border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <div className="text-accent">{icon}</div>
        </div>
        <p className="text-3xl font-bold">{value}</p>
        {change && (
          <div className={cn(
            "flex items-center mt-2 text-xs",
            change.isPositive ? "text-green-400" : "text-red-400"
          )}>
            {change.isPositive ? 
              <ArrowUp className="h-3 w-3 mr-1" /> : 
              <ArrowDown className="h-3 w-3 mr-1" />
            }
            <span>{change.text || `${change.value}% from last month`}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
