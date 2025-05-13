import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import SocialMedia from '../pages/SocialMedia';
import ApplicationName from '../pages/ApplicationName';
import Logos from '../pages/Logos';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import TermsEditor from '../pages/TermsEditor';
import PrivacyPolicyEditor from '../pages/PrivacyPolicyEditor';
import ShippingPolicyEditor from '../pages/ShippingPolicyEditor';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:ml-64 transition-all duration-300">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Header title="Dashboard" subtitle="Overview of your business" />
                <Dashboard />
              </>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <>
                <Header title="Customers" subtitle="Manage your customers" />
                <Customers />
              </>
            } 
          />
          <Route 
            path="/products" 
            element={
              <>
                <Header title="Products" subtitle="Manage your product catalog" />
                <Products />
              </>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <>
                <Header title="Orders" subtitle="Manage orders" />
                <Orders />
              </>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <>
                <Header title="Reports & Analytics" subtitle="Business insights and performance" />
                <Reports />
              </>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <>
                <Header title="Settings" subtitle="Configure your store" />
                <Settings />
              </>
            } 
          />
          <Route 
            path="/settings/social-media" 
            element={
              <>
                <Header title="Settings" subtitle="Configure your store" />
                <SocialMedia />
              </>
            } 
          />
          <Route 
            path="/settings/application-name" 
            element={
              <>
                <Header title="Settings" subtitle="Configure your store" />
                <ApplicationName />
              </>
            } 
          />
          <Route 
            path="/settings/logos" 
            element={
              <>
                <Header title="Logo Settings" subtitle="Manage your website logos" />
                <Logos />
              </>
            } 
          />
          <Route 
            path="/settings/terms-editor" 
            element={
              <>
                <Header title="Terms & Conditions" subtitle="Edit terms and conditions" />
                <TermsEditor />
              </>
            }
          />
          <Route 
            path="/settings/privacy-policy-editor" 
            element={
              <>
                <Header title="Privacy Policy" subtitle="Edit privacy policy" />
                <PrivacyPolicyEditor />
              </>
            }
          />
          <Route 
            path="/settings/shipping-policy-editor" 
            element={
              <>
                <Header title="Shipping Policy" subtitle="Edit shipping policy" />
                <ShippingPolicyEditor />
              </>
            }
          />
          <Route 
            path="/profile" 
            element={
              <>
                <Header title="Profile" subtitle="Manage your profile" />
                <Profile />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppLayout;