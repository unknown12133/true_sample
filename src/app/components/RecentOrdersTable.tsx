import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

const recentOrders = [
  {
    id: '#ORD-1245',
    customer: 'Rajesh Kumar',
    product: 'Organic Milk',
    quantity: '2L',
    amount: '₹ 130.00',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    id: '#ORD-1244',
    customer: 'Priya Sharma',
    product: 'Homemade Pot Curd',
    quantity: '1L',
    amount: '₹ 150.00',
    status: 'Processing',
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: '#ORD-1243',
    customer: 'Amit Patel',
    product: 'True Harvest Fruit Bowl',
    quantity: '2',
    amount: '₹ 280.00',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    id: '#ORD-1242',
    customer: 'Lakshmi Reddy',
    product: 'True Harvest Sprout Bowl',
    quantity: '1',
    amount: '₹ 140.00',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: '#ORD-1241',
    customer: 'Vikram Singh',
    product: 'Organic Milk',
    quantity: '3L',
    amount: '₹ 195.00',
    status: 'Delivered',
    statusColor: 'bg-green-100 text-green-800',
  },
];

export function RecentOrdersTable() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest customer orders</p>
          </div>
          <button className="text-sm text-primary hover:underline">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={order.statusColor}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
