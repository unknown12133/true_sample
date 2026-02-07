import { StatCard } from '@/app/components/StatCard';
import { SalesChart } from '@/app/components/SalesChart';
import { ProductCategoriesChart } from '@/app/components/ProductCategoriesChart';
import { RecentOrdersTable } from '@/app/components/RecentOrdersTable';
import { TopProductsCard } from '@/app/components/TopProductsCard';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="₹ 4,53,820"
          change={12.5}
          icon={DollarSign}
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Total Orders"
          value="2,845"
          change={8.2}
          icon={ShoppingCart}
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Products Sold"
          value="8,234"
          change={15.3}
          icon={Package}
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Active Customers"
          value="1,249"
          change={-2.4}
          icon={Users}
          iconBg="bg-primary/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <ProductCategoriesChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div>
          <TopProductsCard />
        </div>
      </div>
    </div>
  );
}
