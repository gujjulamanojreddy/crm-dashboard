import React from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../ui/Table';
import { cn } from '../../utils/cn';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  status: 'new' | 'processing' | 'delivered' | 'cancelled';
  date: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface RecentOrdersTableProps {
  orders: Order[];
  className?: string;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders, className }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: Order['paymentStatus']) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn('overflow-hidden', className)}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Order ID</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Payment</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      getStatusColor(order.status)
                    )}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      getPaymentStatusColor(order.paymentStatus)
                    )}
                  >
                    {order.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye size={16} className="text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal size={16} className="text-gray-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrdersTable;