import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TablePagination } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import AddCustomerForm from '../components/forms/AddCustomerForm';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toaster';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const totalPages = Math.ceil(customers.length / parseInt(entriesPerPage));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      toast('Failed to fetch customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
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

  return (
    <div className="p-4 md:p-6">
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <AddCustomerForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg font-medium">All Customers</CardTitle>
            <Button 
              leftIcon={<Plus size={16} />} 
              variant="primary"
              onClick={() => setShowAddForm(true)}
            >
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
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={handleSearch}
                  leftIcon={<Search size={16} />}
                  className="w-full sm:w-64"
                />
                <Button
                  variant="outline"
                  leftIcon={<Filter size={16} />}
                >
                  Filter
                </Button>
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
                  {customers.map((customer) => (
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
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={16} />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash size={16} />
                          </button>
                          <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Customers;