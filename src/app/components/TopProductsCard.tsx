import { Card } from '@/app/components/ui/card';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';

const topProducts = [
  {
    name: 'Organic Milk',
    sales: 1245,
    revenue: '₹ 81,925',
    stock: 450,
    trend: '+12%',
    image: '🥛',
  },
  {
    name: 'Homemade Pot Curd',
    sales: 890,
    revenue: '₹ 133,500',
    stock: 280,
    trend: '+8%',
    image: '🥣',
  },
  {
    name: 'True Harvest Fruit Bowl',
    sales: 567,
    revenue: '₹ 79,380',
    stock: 120,
    trend: '+15%',
    image: '🍓',
  },
  {
    name: 'True Harvest Sprout Bowl',
    sales: 423,
    revenue: '₹ 59,220',
    stock: 85,
    trend: '+5%',
    image: '🌱',
  },
];

export function TopProductsCard() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Top Products</h3>
          <p className="text-sm text-muted-foreground">Best performing products this month</p>
        </div>

        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="size-12 rounded-lg bg-card flex items-center justify-center text-2xl">
                {product.image}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="size-3" />
                    {product.sales} sold
                  </span>
                  <span className={`flex items-center gap-1 ${product.stock < 100 ? 'text-yellow-600' : ''
                    }`}>
                    <AlertCircle className="size-3" />
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">{product.revenue}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  {product.trend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
