import { Card } from '@/app/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 4200, orders: 120 },
  { month: 'Feb', sales: 5100, orders: 145 },
  { month: 'Mar', sales: 4800, orders: 135 },
  { month: 'Apr', sales: 6200, orders: 178 },
  { month: 'May', sales: 7500, orders: 210 },
  { month: 'Jun', sales: 8100, orders: 235 },
  { month: 'Jul', sales: 7800, orders: 220 },
  { month: 'Aug', sales: 9200, orders: 265 },
  { month: 'Sep', sales: 8900, orders: 250 },
  { month: 'Oct', sales: 10100, orders: 290 },
  { month: 'Nov', sales: 11500, orders: 325 },
  { month: 'Dec', sales: 12800, orders: 360 },
];

export function SalesChart() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Sales Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly sales performance</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a5042" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1a5042" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4dc" />
            <XAxis 
              dataKey="month" 
              stroke="#6b6b6b"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b6b6b"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e8e4dc',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#1a5042" 
              strokeWidth={2}
              fill="url(#salesGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
