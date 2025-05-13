import React from 'react';

const SocialMedia: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Social Media</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Facebook</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              defaultValue="https://www.facebook.com/"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Twitter</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              defaultValue="https://x.com/"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Instagram</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              defaultValue="https://www.instagram.com/"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Youtube</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              defaultValue="https://www.youtube.com/"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Linkedin</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              defaultValue="https://in.linkedin.com/"
            />
          </div>

          <div className="pt-2">
            <button
              className="bg-green-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
