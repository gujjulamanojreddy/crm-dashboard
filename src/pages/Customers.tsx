import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Trash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TablePagination } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import AddCustomerForm, { CustomerData } from '../components/forms/AddCustomerForm';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  company_name: string | null;
  gst_number: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomerTableData extends Customer {
  name: string;
  dateRegistered: string;
  lastPurchase: string;
  totalOrders: number;
  totalSpent: number;
}

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerTableData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | undefined>(undefined);
  const { toast } = useToast();

  const totalPages = Math.ceil(customers.length / parseInt(entriesPerPage));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // First check if we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        toast("Please login first", "error");
        return;
      }

      if (!user) {
        toast("Please login to view customers", "error");
        return;
      }

      // Then fetch customers
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          orders:orders(
            id,
            amount,
            status,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      // Transform the data to match the table structure
      const transformedData: CustomerTableData[] = data.map((customer: any) => {
        const orders = customer.orders || [];
        const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0);
        const lastOrder = orders.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' } as const;

        return {
          ...customer,
          name: `${customer.first_name} ${customer.last_name}`,
          dateRegistered: new Date(customer.created_at).toLocaleDateString('en-US', dateOptions),
          lastPurchase: lastOrder ? new Date(lastOrder.created_at).toLocaleDateString('en-US', dateOptions) : 'No purchases yet',
          totalOrders: orders.length,
          totalSpent: totalSpent
        };
      });

      setCustomers(transformedData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast("Failed to fetch customers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setEditingCustomer(undefined);
    fetchCustomers();
  };

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleEditClick = (customer: CustomerTableData) => {
    const customerData: CustomerData = {
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      street_address: customer.street_address,
      country: customer.country,
      city: customer.city,
      state: customer.state,
      zip_code: customer.zip_code,
      company_name: customer.company_name,
      gst_number: customer.gst_number,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    };
    setEditingCustomer(customerData);
    setShowAddForm(true);
  };

  const handleDeleteClick = async (customerId: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      toast("Customer deleted successfully", "success");
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast("Failed to delete customer", "error");
    }
  };

  const handleViewDetails = async (customer: CustomerTableData) => {
    try {
      const formattedDetails = `
Customer Details:
━━━━━━━━━━━━━━━━
Name: ${customer.first_name} ${customer.last_name}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${customer.street_address || 'N/A'}
Location: ${customer.city}, ${customer.state}, ${customer.country}
ZIP: ${customer.zip_code}

Company Details:
━━━━━━━━━━━━━━━━
Company: ${customer.company_name || 'N/A'}
GST: ${customer.gst_number || 'N/A'}

Order Information:
━━━━━━━━━━━━━━━━
Total Orders: ${customer.totalOrders}
Last Purchase: ${customer.lastPurchase}
Total Spent: ₹${customer.totalSpent.toLocaleString()}`;

      toast(formattedDetails);
    } catch (error) {
      console.error('Error showing customer details:', error);
      toast("Failed to show customer details", "error");
    }
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof CustomerTableData];
      const bValue = b[sortBy as keyof CustomerTableData];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

  // Paginate customers
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  return (
    <div className="p-4 md:p-6">
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddCustomerForm
              onSuccess={handleAddSuccess}
              onCancel={() => {
                setShowAddForm(false);
                setEditingCustomer(undefined);
              }}
              editingCustomer={editingCustomer}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg font-medium">All Customers</CardTitle>
            <Button 
              onClick={() => setShowAddForm(true)}
              variant="primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div>
                  <label htmlFor="entries" className="text-sm text-gray-500">Show</label>
                  <Select
                    id="entries"
                    value={entriesPerPage}
                    onChange={handleEntriesChange}
                    options={[
                      { value: '10', label: '10' },
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: '100', label: '100' },
                    ]}
                    className="w-16 mx-2"
                  />
                  <span className="text-sm text-gray-500">entries</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Input
                  type="search"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="search"
                  leftIcon={<Search className="h-4 w-4 transition-colors duration-200" />}
                  className="w-full sm:w-80"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Customer Name
                        {sortBy === 'name' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHeader>
                    <TableHeader>Email & Phone</TableHeader>
                    <TableHeader>Date Registered</TableHeader>
                    <TableHeader>Last Purchase</TableHeader>
                    <TableHeader 
                      className="cursor-pointer"
                      onClick={() => handleSort('totalOrders')}
                    >
                      <div className="flex items-center">
                        Orders
                        {sortBy === 'totalOrders' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHeader>
                    <TableHeader 
                      className="cursor-pointer"
                      onClick={() => handleSort('totalSpent')}
                    >
                      <div className="flex items-center">
                        Total Spent
                        {sortBy === 'totalSpent' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </TableHeader>
                    <TableHeader className="text-right">Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : paginatedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{customer.email}</span>
                            <span className="text-xs text-gray-500">{customer.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>{customer.dateRegistered}</TableCell>
                        <TableCell>{customer.lastPurchase}</TableCell>
                        <TableCell>{customer.totalOrders > 0 ? customer.totalOrders : 'No Orders'}</TableCell>
                        <TableCell>{customer.totalSpent > 0 ? `₹${customer.totalSpent.toLocaleString()}` : '₹0'}</TableCell>
                        <TableCell>
                          <div className="flex justify-end items-center space-x-2">
                            <button 
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              onClick={() => handleViewDetails(customer)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                              onClick={() => handleEditClick(customer)}
                              title="Edit Customer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              onClick={() => handleDeleteClick(customer.id)}
                              title="Delete Customer"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {paginatedCustomers.length > 0 && (
              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Customers;