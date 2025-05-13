import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleEdit = (page: string) => {
    switch (page) {
      case 'terms':
        navigate('/settings/terms-editor');
        break;
      case 'privacy':
        navigate('/settings/privacy-policy-editor');
        break;
      case 'shipping':
        navigate('/settings/shipping-policy-editor');
        break;
      case 'about':
        navigate('/settings/about-editor');
        break;
      case 'refund':
        navigate('/settings/refund-policy-editor');
        break;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page Title and Subtitle */}
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Configure your store</p>

      <Card>
        <CardContent className="p-6">
          {/* Content Heading */}
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Content
          </h2>
          
          {/* Table container */}
          <div className="-mx-6 -my-2 overflow-x-auto"> {/* Adjust negative margins if CardContent padding changes */}
            <div className="inline-block min-w-full py-2 align-middle px-6"> {/* Adjust padding to match CardContent */}
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Page
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Terms & Conditions
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit('terms')}
                          className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Privacy Policy
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit('privacy')}
                          className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Shipping Policy
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit('shipping')}
                          className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Refund policy
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit('refund')}
                          className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        About Us
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit('about')}
                          className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;