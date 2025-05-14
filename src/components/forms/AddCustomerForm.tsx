import React, { useState } from 'react';
import { useToast } from '../ui/Toaster';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

export interface CustomerData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  company_name?: string | null;
  gst_number?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AddCustomerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editingCustomer?: CustomerData;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSuccess, onCancel, editingCustomer }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: editingCustomer?.first_name || '',
    lastName: editingCustomer?.last_name || '',
    email: editingCustomer?.email || '',
    phone: editingCustomer?.phone || '',
    streetAddress: editingCustomer?.street_address || '',
    country: editingCustomer?.country || '',
    city: editingCustomer?.city || '',
    state: editingCustomer?.state || '',
    zipCode: editingCustomer?.zip_code || '',
    companyName: editingCustomer?.company_name || '',
    gstNumber: editingCustomer?.gst_number || '',
  });

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    let numbers = input.replace(/\D/g, '');
    // Limit to 10 digits
    numbers = numbers.substring(0, 10);
    return numbers;
  };

  const formatGSTNumber = (input: string) => {
    // Remove spaces and make uppercase
    let gst = input.replace(/\s/g, '').toUpperCase();
    // Limit to 15 characters (standard GST length)
    gst = gst.substring(0, 15);
    return gst;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;

    // Apply specific formatting for certain fields
    switch (name) {
      case 'phone':
        formattedValue = formatPhoneNumber(value);
        break;
      case 'gstNumber':
        formattedValue = formatGSTNumber(value);
        break;
      case 'zipCode':
        formattedValue = value.replace(/\D/g, '').substring(0, 6); // Only digits, max 6
        break;
      case 'email':
        formattedValue = value.toLowerCase().trim();
        break;
      case 'firstName':
      case 'lastName':
        // Capitalize first letter
        formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
        break;
      default:
        formattedValue = value;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast('First name is required', 'error');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast('Last name is required', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      toast('Email is required', 'error');
      return false;
    }
    if (!formData.phone.trim()) {
      toast('Phone number is required', 'error');
      return false;
    }
    if (!formData.streetAddress.trim()) {
      toast('Street address is required', 'error');
      return false;
    }
    if (!formData.country.trim()) {
      toast('Country is required', 'error');
      return false;
    }
    if (!formData.city.trim()) {
      toast('City is required', 'error');
      return false;
    }
    if (!formData.state.trim()) {
      toast('State is required', 'error');
      return false;
    }
    if (!formData.zipCode.trim()) {
      toast('ZIP code is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Basic validation
      if (!formData.email.includes('@')) {
        toast('Please enter a valid email address', 'error');
        return;
      }

      if (formData.phone.length < 10) {
        toast('Please enter a valid phone number', 'error');
        return;
      }

      // Check if email already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingCustomer && (!editingCustomer || existingCustomer.id !== editingCustomer.id)) {
        toast('A customer with this email already exists', 'error');
        return;
      }

      // Prepare customer data
      const customerData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        street_address: formData.streetAddress,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        company_name: formData.companyName || null,
        gst_number: formData.gstNumber || null,
        updated_at: new Date().toISOString()
      };

      let data, error;

      if (editingCustomer?.id) {
        // Update existing customer
        ({ data, error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', editingCustomer.id)
          .select()
          .single());
      } else {
        // Insert new customer
        ({ data, error } = await supabase
          .from('customers')
          .insert([{
            ...customerData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single());
      }

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast('A customer with this email already exists', 'error');
        } else {
          console.error('Supabase error:', error);
          toast('Failed to add customer: ' + error.message, 'error');
        }
        return;
      }

      if (!data) {
        toast('Failed to add customer: No data returned', 'error');
        return;
      }

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        streetAddress: '',
        country: '',
        city: '',
        state: '',
        zipCode: '',
        companyName: '',
        gstNumber: '',
      });

      toast(
        editingCustomer 
          ? 'Customer updated successfully' 
          : 'Customer added successfully',
        'success'
      );
      onSuccess?.();
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast('Failed to add customer: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        placeholder="example@domain.com"
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        pattern="[0-9]*"
        maxLength={10}
        placeholder="Enter 10-digit phone number"
        required
      />

      <Input
        label="Street Address"
        name="streetAddress"
        value={formData.streetAddress}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <Input
          label="ZIP Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Company Name"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
      />

      <Input
        label="GST Number"
        name="gstNumber"
        value={formData.gstNumber}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          {editingCustomer ? 'Update Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
};

export default AddCustomerForm;