import React, { useState } from 'react';
import { FileSpreadsheet, Search, Eye, Truck, XOctagon, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TablePagination } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toaster';
import { exportToExcel } from '../utils/exportToExcel';

// Mock data
const mockNewOrders = [
  {
    id: '202500000005',
    customer: {
      name: 'Pawan Kumar',
      email: 'pawan@example.com',
    },
    amount: 6990,
    status: 'new',
    date: 'Tue, 29 Apr 2025, 7:53 am',
    paymentStatus: 'pending',
  },
  {
    id: '202500000004',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
    },
    amount: 3499,
    status: 'new',
    date: 'Mon, 28 Apr 2025, 2:30 pm',
    paymentStatus: 'paid',
  },
  {
    id: '202500000001',
    customer: {
      name: 'Neha Gupta',
      email: 'neha@example.com',
    },
    amount: 2499,
    status: 'new',
    date: 'Fri, 25 Apr 2025, 9:20 am',
    paymentStatus: 'paid',
  },
];

const NewOrders: React.FC = () => {
  const [orders, setOrders] = useState(mockNewOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('orderId');
  
  const { toast } = useToast();
  
  // Filter to show only orders with 'new' status
  const filteredOrders = orders
    .filter(order => order.status === 'new')
    .filter(order => {
      if (!searchTerm) return true;
      
      switch (searchType) {
        case 'orderId':
          return order.id.toLowerCase().includes(searchTerm.toLowerCase());
        case 'customer':
          return order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        case 'email':
          return order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
  
  const newOrders = filteredOrders;
  const totalPages = Math.ceil(newOrders.length / parseInt(entriesPerPage));
  
  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    setCurrentPage(1);
  };
  
  const processOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'processing' } : order
    ));
    toast('Order #' + orderId + ' has been set to processing', 'success');
  };
  
  const cancelOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
    toast('Order #' + orderId + ' has been cancelled', 'error');
  };
  
  const acceptPayment = (orderId: string) => {
    setOrders(orders.map(order => {
      // If the order was in 'new' status and payment is now accepted, 
      // automatically set it to processing status as well
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          paymentStatus: 'paid' 
        };
        
        // If the order status is still 'new', automatically update it to 'processing'
        if (order.status === 'new') {
          updatedOrder.status = 'processing';
          toast(`Order #${orderId} has been set to processing and payment accepted`, 'success');
        } else {
          toast(`Payment for Order #${orderId} has been accepted`, 'success');
        }
        
        return updatedOrder;
      }
      return order;
    }));
  };
  
  const viewOrderDetails = (orderId: string) => {
    // In a real application, this would navigate to the order details page
    // or open a modal with order details
    toast('Viewing details for Order #' + orderId, 'info');
  };
  
  const handleExportToExcel = async () => {
    try {
      // Format data for export - use only the filtered new orders
      const exportData = newOrders.map(order => ({
        'Order ID': order.id,
        'Customer': order.customer.name,
        'Email': order.customer.email,
        'Amount': `₹${order.amount.toLocaleString()}`,
        'Date': order.date,
        'Payment Status': order.paymentStatus === 'paid' ? 'Paid' : 'Not Paid',
        'Order Status': order.status
      }));
      
      if (exportData.length === 0) {
        toast('No new orders to export', 'info');
        return;
      }
      
      await exportToExcel(exportData, 'New_Orders_List');
      toast('Orders exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      toast('Failed to export orders', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg font-medium">New Orders</CardTitle>
          <Button 
            leftIcon={<FileSpreadsheet size={16} />} 
            variant="success"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
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
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Select
                  label="Search by"
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  options={[
                    { value: 'orderId', label: 'Order ID' },
                    { value: 'customer', label: 'Customer' },
                    { value: 'email', label: 'Email' },
                  ]}
                  className="w-40"
                />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="search"
                  leftIcon={<Search className="h-4 w-4 transition-colors duration-200" />}
                  className="w-full sm:w-80 pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Order ID</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Order Value</TableHeader>
                  <TableHeader>Order At</TableHeader>
                  <TableHeader>Payment</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {newOrders.length > 0 ? (
                  newOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-xs text-gray-500">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Not Paid'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                            title="View Order"
                            onClick={() => viewOrderDetails(order.id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded" 
                            title="Process Order"
                            onClick={() => processOrder(order.id)}
                          >
                            <Truck size={16} />
                          </button>
                          <button 
                            className={`p-1 rounded ${
                              order.paymentStatus === 'paid' 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title="Accept Payment"
                            onClick={() => order.paymentStatus !== 'paid' && acceptPayment(order.id)}
                            disabled={order.paymentStatus === 'paid'}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:bg-red-50 rounded" 
                            title="Cancel Order"
                            onClick={() => cancelOrder(order.id)}
                          >
                            <XOctagon size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No new orders found
                    </TableCell>
                  </TableRow>
                )}
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
    </div>
  );
};

export default NewOrders;