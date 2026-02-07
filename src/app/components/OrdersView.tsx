import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Pagination } from '@/app/components/Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Download,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Delivered' | 'Processing' | 'Pending' | 'Cancelled' | 'Shipped';
  orderDate: string;
  deliveryDate?: string;
}


const statusConfig = {
  Delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  Shipped: { color: 'bg-blue-100 text-blue-800', icon: Truck },
  Processing: { color: 'bg-yellow-100 text-yellow-800', icon: Package },
  Pending: { color: 'bg-orange-100 text-orange-800', icon: Clock },
  Cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
};

const paymentStatusConfig = {
  Paid: { color: 'bg-green-100 text-green-800' },
  Pending: { color: 'bg-yellow-100 text-yellow-800' },
  Failed: { color: 'bg-red-100 text-red-800' },
};

export function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.getAll();

        const mappedOrders: Order[] = data.map((item: any) => ({
          id: item.order_id,
          orderNumber: `#${item.order_id}`,
          customer: {
            name: item.userid || 'Unknown Customer',
            phone: item.mobile || '',
            email: 'N/A',
            address: item.delivery_address || '',
          },
          items: [
            {
              name: item.product_name,
              quantity: item.quantities,
              price: item.quantities > 0 ? item.total_amount / item.quantities : 0,
            }
          ],
          totalAmount: item.total_amount,
          paymentMethod: item.payment_mode,
          paymentStatus: 'Pending', // Default, adjust based on logic if available
          orderStatus: mapApiStatusToOrderStatus(item.status),
          orderDate: new Date(item.created_at).toLocaleString(),
          deliveryDate: item.updated_at ? new Date(item.updated_at).toLocaleString() : undefined,
        }));

        setOrders(mappedOrders);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const mapApiStatusToOrderStatus = (status: string): Order['orderStatus'] => {
    const normalized = status.toUpperCase();
    switch (normalized) {
      case 'DELIVERED': return 'Delivered';
      case 'SHIPPED': return 'Shipped';
      case 'PROCESSING': return 'Processing';
      case 'PENDING': return 'Pending';
      case 'CANCELLED': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Orders Management</h2>
          <p className="text-muted-foreground">Track and manage all customer orders</p>
        </div>

      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order number, customer name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto whitespace-nowrap"
          onClick={() => {
            if (filteredOrders.length === 0) {
              toast.error('No orders to export');
              return;
            }

            const headers = ['Order ID', 'Customer Name', 'Phone', 'Items', 'Total Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Order Date'];
            const csvContent = [
              headers.join(','),
              ...filteredOrders.map(order => {
                const itemsStr = order.items.map(i => `${i.quantity}x ${i.name}`).join('; ');
                return [
                  order.orderNumber,
                  `"${order.customer.name}"`,
                  order.customer.phone,
                  `"${itemsStr}"`,
                  order.totalAmount,
                  order.paymentMethod,
                  order.paymentStatus,
                  order.orderStatus,
                  `"${order.orderDate}"`
                ].join(',');
              })
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Orders exported successfully');
          }}
        >
          <Download className="size-4 mr-2" />
          Export Orders
        </Button>
      </div>



      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-center">Payment Type</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => {
                const StatusIcon = statusConfig[order.orderStatus].icon;
                return (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="size-3" />
                          {order.customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-sm">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹ {order.totalAmount}</TableCell>
                    <TableCell className="text-center">
                      <p className="text-sm">{order.paymentMethod}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={paymentStatusConfig[order.paymentStatus].color}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${statusConfig[order.orderStatus].color} flex items-center gap-1 w-fit`}
                      >
                        <StatusIcon className="size-3" />
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="size-3 text-muted-foreground" />
                        {order.orderDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="border-t p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredOrders.length}
          />
        </div>
      </Card>

      {/* Order Details Modal/Card */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Order Details</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.orderNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" />
                      Delivery Address
                    </p>
                    <p className="font-medium">{selectedOrder.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹ {item.price}</TableCell>
                          <TableCell className="text-right">₹ {item.quantity * item.price}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-secondary/50">
                        <TableCell colSpan={3} className="font-semibold">Total Amount</TableCell>
                        <TableCell className="text-right font-bold text-lg text-primary">
                          ₹ {selectedOrder.totalAmount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Payment & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Payment Details</h4>
                  <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    <Badge className={paymentStatusConfig[selectedOrder.paymentStatus].color}>
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Order Status</h4>
                  <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.orderDate}</span>
                    </div>
                    <Badge className={statusConfig[selectedOrder.orderStatus].color}>
                      {selectedOrder.orderStatus}
                    </Badge>
                    {selectedOrder.deliveryDate && (
                      <p className="text-sm text-muted-foreground">
                        Delivered: {selectedOrder.deliveryDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => toast.success('Status Updated', { description: 'The order status have been updated.' })}
                >
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.info('Downloading...', { description: 'Your invoice is being generated.' })}
                >
                  <Download className="size-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No orders found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
