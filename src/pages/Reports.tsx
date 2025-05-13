import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BarChart2, TrendingUp, Download, Calendar } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

// Mock data for top cities
const topCities = [
  { city: 'Mumbai', orders: 256, revenue: 1254690 },
  { city: 'Delhi', orders: 184, revenue: 894320 },
  { city: 'Bangalore', orders: 142, revenue: 723560 },
  { city: 'Hyderabad', orders: 97, revenue: 486240 },
  { city: 'Chennai', orders: 89, revenue: 412340 },
  { city: 'Pune', orders: 72, revenue: 356780 },
  { city: 'Kolkata', orders: 64, revenue: 312450 },
  { city: 'Ahmedabad', orders: 53, revenue: 267890 },
  { city: 'Jaipur', orders: 41, revenue: 212350 },
  { city: 'Chandigarh', orders: 26, revenue: 134560 },
];

// Mock data for top products
const topProducts = [
  { name: 'Smartphone X Pro', orders: 124, revenue: 1239876 },
  { name: 'Wireless Earbuds', orders: 98, revenue: 196002 },
  { name: 'Smart Watch', orders: 87, revenue: 435913 },
  { name: 'Laptop Sleeve', orders: 76, revenue: 75924 },
  { name: 'Power Bank', orders: 65, revenue: 64935 },
];

// Mock data for least selling products
const leastProducts = [
  { name: 'USB Cable Type-C', orders: 6, revenue: 2994 },
  { name: 'Phone Stand', orders: 5, revenue: 2495 },
  { name: 'Screen Protector', orders: 4, revenue: 1996 },
  { name: 'Desk Organizer', orders: 3, revenue: 1497 },
  { name: 'Mouse Pad', orders: 2, revenue: 998 },
];

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('today');
  
  // Mock data for stats
  const stats = {
    today: { orders: 42, revenue: 219870, newUsers: 15 },
    yesterday: { orders: 38, revenue: 198450, newUsers: 12 },
    thisWeek: { orders: 187, revenue: 945230, newUsers: 54 },
    thisMonth: { orders: 856, revenue: 4325690, newUsers: 210 },
  };
  
  // Get current stats based on selected time range
  const currentStats = stats[timeRange as keyof typeof stats];
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select
            options={[
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'thisWeek', label: 'This Week' },
              { value: 'thisMonth', label: 'This Month' },
            ]}
            value={timeRange}
            onChange={setTimeRange}
            leftIcon={<Calendar size={16} className="text-gray-500" />}
            className="w-40"
          />
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{currentStats.orders}</h3>
                <p className="text-xs text-gray-500 mt-1">{timeRange === 'today' ? "Today's performance" : timeRange === 'yesterday' ? "Yesterday's performance" : timeRange === 'thisWeek' ? "This week's performance" : "This month's performance"}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <BarChart2 size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{currentStats.revenue.toLocaleString()}</h3>
                <p className="text-xs text-gray-500 mt-1">{timeRange === 'today' ? "Today's earnings" : timeRange === 'yesterday' ? "Yesterday's earnings" : timeRange === 'thisWeek' ? "This week's earnings" : "This month's earnings"}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <DollarSign size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Users</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{currentStats.newUsers}</h3>
                <p className="text-xs text-gray-500 mt-1">{timeRange === 'today' ? "Today's registrations" : timeRange === 'yesterday' ? "Yesterday's registrations" : timeRange === 'thisWeek' ? "This week's registrations" : "This month's registrations"}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                <Users size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">Sales & Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-gray-400 border-t border-gray-200 mt-4 pt-4">
              <div className="flex flex-col items-center">
                <TrendingUp size={48} strokeWidth={1} />
                <p className="mt-2">Sales chart visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">🏙️ Top 10 Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>City</TableHeader>
                  <TableHeader>Orders</TableHeader>
                  <TableHeader>Revenue</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCities.slice(0, 5).map((city, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{city.city}</TableCell>
                    <TableCell>{city.orders}</TableCell>
                    <TableCell>₹{city.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800">
              View All Cities
            </button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">📈 Top 5 Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Orders</TableHeader>
                  <TableHeader>Revenue</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.orders}</TableCell>
                    <TableCell>₹{product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-medium">📉 Least 5 Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Orders</TableHeader>
                  <TableHeader>Revenue</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {leastProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.orders}</TableCell>
                    <TableCell>₹{product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}