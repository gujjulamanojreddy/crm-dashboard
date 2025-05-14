import React from 'react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface CustomerDetailsModalProps {
  customer: any;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Details</CardTitle>          <Button
            variant="secondary"
            onClick={onClose}
            className="p-2"
          >
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{customer.first_name} {customer.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered On</p>
                <p className="font-medium">{customer.dateRegistered}</p>
              </div>
            </div>
          </div>

          {(customer.company_name || customer.gst_number) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {customer.company_name && (
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="font-medium">{customer.company_name}</p>
                  </div>
                )}
                {customer.gst_number && (
                  <div>
                    <p className="text-sm text-gray-500">GST Number</p>
                    <p className="font-medium">{customer.gst_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Street Address</p>
                <p className="font-medium">{customer.street_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{customer.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="font-medium">{customer.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{customer.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ZIP Code</p>
                <p className="font-medium">{customer.zip_code}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="font-medium">{customer.totalOrders || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="font-medium">₹{(customer.totalSpent || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Purchase</p>
                <p className="font-medium">{customer.lastPurchase || 'No purchases yet'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailsModal;
