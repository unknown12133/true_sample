import { Card } from '@/app/components/ui/card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconBg: string;
}

export function StatCard({ title, value, change, icon: Icon, iconBg }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold">{value}</p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="size-4 text-green-600" />
            ) : (
              <ArrowDownRight className="size-4 text-red-600" />
            )}
            <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className="size-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
