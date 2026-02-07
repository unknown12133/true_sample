import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  FormEvent,
  ChangeEvent
} from 'react';
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
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  UserX,
  Download,
  Edit,
  Loader2,
  Plus,
  Copy,
  Check,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from 'sonner';
import { api } from '../../services/api';

interface Address {
  city: string;
  state: string;
  location: string;
  street?: string;
  type?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  lastOrder: string;
  avgOrderValue: number;
}

export function CustomersView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [originalMobile, setOriginalMobile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Form state for adding customer
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: 'Male',
    role: 'REALUSER',
    city: 'Hyderabad',
    location: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation: Mandatory and Only characters (letters and spaces)
    if (!newCustomer.name || newCustomer.name.trim() === '') {
      errors.name = 'Full name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(newCustomer.name)) {
      errors.name = 'Please enter a valid full name (letters only)';
    }

    // Mobile validation: Exactly 10 digits
    if (!newCustomer.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(newCustomer.mobile)) {
      errors.mobile = 'Mobile number must be exactly 10 digits';
    }

    // Email validation: Mandatory and Proper format
    if (!newCustomer.email || newCustomer.email.trim() === '') {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newCustomer.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.users.getAll();

      const mappedCustomers: Customer[] = data.map((raw: any) => {
        const addresses = raw.addresses || [];
        const addr = addresses.length > 0 ? addresses[0] : {};
        const city = addr.city || 'Hyderabad';
        const state = addr.state || 'Telangana';
        const addressStr = addr.location || (addr.city ? `${addr.street ? addr.street + ', ' : ''}${addr.city}` : 'Not provided');

        // Differentiate between demo users (with mock data) and new users (empty stats)
        const isNewUser = new Date(raw.created_at) > new Date('2026-02-02T11:00:00Z');

        const totalOrders = isNewUser ? 0 : Math.floor(Math.random() * 50) + 5;
        const totalSpent = isNewUser ? 0 : Math.floor(Math.random() * 15000) + 1000;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

        return {
          id: raw.userid,
          name: raw.name && raw.name.trim() !== '' ? raw.name : 'Anonymous',
          email: raw.email && raw.email.trim() !== '' ? raw.email : 'No Email',
          phone: raw.mobile,
          address: addressStr,
          city,
          state,
          joinDate: raw.created_at,
          totalOrders,
          totalSpent,
          status: raw.is_active ? 'Active' : 'Inactive',
          lastOrder: raw.updated_at,
          avgOrderValue
        };
      });

      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditClick = async (customer: Customer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLoading(true); // Show loader while fetching details
    try {
      // Fetch fresh details for the specific user
      const userData = await api.users.getDetails(customer.phone);

      setIsEditMode(true);
      setEditingUserId(customer.id);
      setOriginalMobile(userData.mobile || customer.phone);

      const addresses = userData.addresses;
      const addr = Array.isArray(addresses) && addresses.length > 0 ? addresses[0] : (addresses || {});

      setNewCustomer({
        name: userData.name || '',
        email: userData.email || '',
        mobile: userData.mobile || customer.phone,
        gender: userData.gender || 'Male',
        role: userData.role || 'REALUSER',
        city: addr.city || 'Hyderabad',
        location: addr.location || ''
      });
      setFormErrors({});
      setIsAddModalOpen(true);
      setSelectedCustomer(null); // Close details view if open
    } catch (error: any) {
      toast.error('Error fetching latest user details', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!newCustomer.mobile) {
      setFormErrors({ mobile: 'Mobile number is required' });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        role: newCustomer.role,
        name: newCustomer.name || null,
        email: newCustomer.email || null,
        mobile: newCustomer.mobile,
        gender: newCustomer.gender,
        addresses: [
          {
            city: newCustomer.city,
            location: newCustomer.location,
            type: 'home'
          }
        ]
      };

      if (isEditMode) {
        await api.users.update(originalMobile || newCustomer.mobile, payload);
      } else {
        await api.users.create(payload);
      }

      toast.success(`Customer ${isEditMode ? 'Updated' : 'Added'} Successfully`, {
        description: `${newCustomer.name} has been ${isEditMode ? 'updated in' : 'added to'} your customer list.`,
      });
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setEditingUserId(null);
      setNewCustomer({
        name: '',
        email: '',
        mobile: '',
        gender: 'Male',
        role: 'REALUSER',
        city: 'Hyderabad',
        location: ''
      });
      setFormErrors({});
      fetchCustomers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || `Error ${isEditMode ? 'updating' : 'adding'} customer`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const statuses = ['All', 'Active', 'Inactive'];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statusConfig = {
    Active: { color: 'bg-green-100 text-green-800', icon: UserCheck },
    Inactive: { color: 'bg-red-100 text-red-800', icon: UserX },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Customers Management</h2>
          <p className="text-muted-foreground">Manage and track customer information</p>
        </div>
        <div className="flex gap-3">
          {/* <Button variant="outline" className="hover:bg-secondary">
            <Download className="size-4 mr-2" />
            Export Data
          </Button> */}
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              setIsEditMode(false);
              setEditingUserId(null);
              setNewCustomer({
                name: '',
                email: '',
                mobile: '',
                gender: 'Male',
                role: 'REALUSER',
                city: 'Hyderabad',
                location: ''
              });
              setFormErrors({});
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="size-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold mt-1">{customers.length}</p>
            </div>
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="size-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Customers</p>
              <p className="text-2xl font-bold mt-1">
                {customers.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
              <UserCheck className="size-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">
                ₹ {customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}
              </p>
            </div>
            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="size-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold mt-1">
                ₹ {customers.length > 0 ? Math.round(customers.reduce((acc, c) => acc + c.avgOrderValue, 0) / customers.length) : 0}
              </p>
            </div>
            <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center">
              <ShoppingBag className="size-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-card"
          />
        </div>

        {/* Status Filter */}
        <div className="w-[180px]">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
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
      </div>

      {/* Customers Table */}
      <Card>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading customers...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Avg Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => {
                  const StatusIcon = statusConfig[customer.status].icon;
                  return (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {customer.name.split(' ').map(n => n ? n[0] : '').join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-mono text-muted-foreground">{customer.id}</p>
                              <button
                                onClick={(e) => handleCopyId(customer.id, e)}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground transition-colors"
                                title="Copy ID"
                              >
                                {copiedId === customer.id ? (
                                  <Check className="size-3 text-green-500" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="size-3 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="size-3 text-muted-foreground" />
                          <span>{customer.city}, {customer.state}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {customer.totalOrders} orders
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹ {customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹ {customer.avgOrderValue}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${statusConfig[customer.status].color} flex items-center gap-1 w-fit`}
                        >
                          <StatusIcon className="size-3" />
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                            }}
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleEditClick(customer, e)}
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <Edit className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCustomers.length}
          />
        </div>
      </Card>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <Card className="max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditMode(false);
                  setEditingUserId(null);
                  setFormErrors({});
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Full Name <span className="text-red-500 font-bold">*</span></label>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    value={newCustomer.name}
                    onChange={(e) => {
                      setNewCustomer({ ...newCustomer, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                    }}
                    className={`bg-secondary/40 ${formErrors.name ? 'border-red-500 bg-red-50/50 focus-visible:ring-red-500 font-medium' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 font-bold italic mt-1.5 flex items-center gap-1 leading-tight">
                      <span className="text-[10px]">⚠️</span> {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number <span className="text-red-500 font-bold">*</span></label>
                  <Input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    required
                    value={newCustomer.mobile}
                    onChange={(e) => {
                      // Allow only digits and limit to 10
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setNewCustomer({ ...newCustomer, mobile: val });
                      if (formErrors.mobile) setFormErrors({ ...formErrors, mobile: '' });
                    }}
                    className={`bg-secondary/40 ${formErrors.mobile ? 'border-red-500 bg-red-50/50 focus-visible:ring-red-500 font-medium' : ''}`}
                  />
                  {formErrors.mobile && (
                    <p className="text-xs text-red-500 font-bold italic mt-1.5 flex items-center gap-1 leading-tight">
                      <span className="text-[10px]">⚠️</span> {formErrors.mobile}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email <span className="text-red-500 font-bold">*</span></label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={newCustomer.email}
                    onChange={(e) => {
                      setNewCustomer({ ...newCustomer, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`bg-secondary/40 ${formErrors.email ? 'border-red-500 bg-red-50/50 focus-visible:ring-red-500 font-medium' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 font-bold italic mt-1.5 flex items-center gap-1 leading-tight">
                      <span className="text-[10px]">⚠️</span> {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newCustomer.gender}
                    onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newCustomer.role}
                    onChange={(e) => setNewCustomer({ ...newCustomer, role: e.target.value })}
                  >
                    <option value="REALUSER">Real User</option>
                    <option value="TESTUSER">Test User</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="e.g. Block A, Jubilee Hills"
                    value={newCustomer.location}
                    onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                    className="bg-secondary/40"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditMode(false);
                    setEditingUserId(null);
                    setFormErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Customer' : 'Add Customer'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedCustomer(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary">
                      {selectedCustomer.name.split(' ').map(n => n ? n[0] : '').join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                      <Badge className={statusConfig[selectedCustomer.status].color}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono text-muted-foreground">{selectedCustomer.id}</p>
                      <button
                        onClick={(e) => handleCopyId(selectedCustomer.id, e)}
                        className="p-1 hover:bg-secondary rounded text-muted-foreground transition-colors"
                        title="Copy ID"
                      >
                        {copiedId === selectedCustomer.id ? (
                          <Check className="size-3 text-green-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="size-3" /> Email
                    </p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="size-3" /> Phone
                    </p>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" /> Address
                    </p>
                    <p className="font-medium">
                      {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Order Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-primary">{selectedCustomer.totalOrders}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-primary">₹ {selectedCustomer.totalSpent.toLocaleString()}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Avg Order</p>
                    <p className="text-2xl font-bold text-primary">₹ {selectedCustomer.avgOrderValue}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-bold text-primary">{formatDate(selectedCustomer.joinDate)}</p>
                  </Card>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Recent Activity</h4>
                <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Order Date</span>
                    <span className="font-medium">{formatDate(selectedCustomer.lastOrder)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Since</span>
                    <span className="font-medium">{formatDate(selectedCustomer.joinDate)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Mail className="size-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <ShoppingBag className="size-4 mr-2" />
                  View Orders
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEditClick(selectedCustomer)}
                >
                  <Edit className="size-4 mr-2" />
                  Edit Customer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && paginatedCustomers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No customers found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
