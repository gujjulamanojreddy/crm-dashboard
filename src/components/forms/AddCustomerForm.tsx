import React, { useState } from 'react';
import { useToast } from '../ui/Toaster';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { supabase } from '../../lib/supabase';

interface AddCustomerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('customers').insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        street_address: formData.streetAddress,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        company_name: formData.companyName,
        gst_number: formData.gstNumber,
      }]);

      if (error) throw error;

      toast('Customer added successfully', 'success');
      onSuccess?.();
    } catch (error) {
      toast('Failed to add customer', 'error');
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
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
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
          Add Customer
        </Button>
      </div>
    </form>
  );
};

export default AddCustomerForm;