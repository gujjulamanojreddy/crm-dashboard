import React, { useState } from 'react';
import { useToast } from '../ui/Toaster';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { supabase } from '../../lib/supabase';

interface AddProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    listPrice: '',
    salePrice: '',
    gst: '',
    status: '',
    description: '',
    colors: '',
  });
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newImages = [...images];
      newImages[index] = files[0];
      setImages(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const fileName = `${Date.now()}-${image.name}`;
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, image);

          if (error) throw error;
          return data.path;
        })
      );

      // Insert product data
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        category: formData.category,
        list_price: parseFloat(formData.listPrice),
        sale_price: parseFloat(formData.salePrice),
        gst: formData.gst,
        status: formData.status,
        description: formData.description,
        colors: formData.colors,
        images: imageUrls,
      }]);

      if (error) throw error;

      toast('Product added successfully', 'success');
      onSuccess?.();
    } catch (error) {
      toast('Failed to add product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        maxLength={50}
      />

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        options={[
          { value: '', label: '---select---' },
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' },
          { value: 'accessories', label: 'Accessories' },
        ]}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="List Price"
          type="number"
          name="listPrice"
          value={formData.listPrice}
          onChange={handleChange}
          required
        />
        <Input
          label="Sale Price"
          type="number"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleChange}
          required
        />
      </div>

      <Select
        label="GST"
        name="gst"
        value={formData.gst}
        onChange={(value) => setFormData(prev => ({ ...prev, gst: value }))}
        options={[
          { value: '', label: '---select---' },
          { value: '5', label: '5%' },
          { value: '12', label: '12%' },
          { value: '18', label: '18%' },
          { value: '28', label: '28%' },
        ]}
        required
      />

      <Select
        label="Product Status"
        name="status"
        value={formData.status}
        onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
        options={[
          { value: '', label: '---select---' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'out_of_stock', label: 'Out of Stock' },
        ]}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          maxLength={500}
          required
        />
      </div>

      <Select
        label="Colors"
        name="colors"
        value={formData.colors}
        onChange={(value) => setFormData(prev => ({ ...prev, colors: value }))}
        options={[
          { value: '', label: '--- Select ---' },
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' },
        ]}
        required
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Upload Product Images and Video</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Main Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 0)}
              required
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {[1, 2, 3].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">Image {index}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;