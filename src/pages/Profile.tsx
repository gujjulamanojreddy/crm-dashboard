import React from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
        
        <form className="space-y-4">
          <div>
            <Input
              label="Name *"
              defaultValue="Pawan"
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Email *"
                type="email"
                defaultValue="pk02verma@gmail.com"
                fullWidth
              />
            </div>
            <div>
              <Input
                label="Phone *"
                type="tel"
                fullWidth
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </Button>
            <Button
              type="button"
              className="bg-amber-500 text-white hover:bg-amber-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
