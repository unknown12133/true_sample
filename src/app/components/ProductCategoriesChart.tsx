import { Card } from '@/app/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const categoryData = [
  { name: 'Milk Products', value: 45, color: '#1a5042' },
  { name: 'Pot Curd', value: 25, color: '#4a9d7f' },
  { name: 'Sprouts', value: 15, color: '#7bc4a8' },
  { name: 'Fruit Bowls', value: 10, color: '#a8dcc5' },
  { name: 'Others', value: 5, color: '#d4ebe4' },
];

export function ProductCategoriesChart() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Product Categories</h3>
          <p className="text-sm text-muted-foreground">Sales distribution by category</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e4dc',
                borderRadius: '8px'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span style={{ color: '#1a1a1a', fontSize: '14px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
