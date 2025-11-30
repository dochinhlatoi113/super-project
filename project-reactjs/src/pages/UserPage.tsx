import { useAuth } from '../context/AuthContext';

export default function UserPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'User'}</h1>
            <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
            {/* <p className="text-sm text-indigo-600 font-medium mt-1">{user?.role || 'User'}</p> */}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="mt-1 text-gray-800">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              <p className="mt-1 text-gray-800">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              {/* <p className="mt-1 text-gray-800">{user?.role || 'N/A'}</p> */}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="mt-1 text-gray-800">{user?.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Settings</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Change Password</p>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full text-left px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Update Profile</p>
              <p className="text-sm text-gray-500">Edit your profile information</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full text-left px-6 py-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Privacy Settings</p>
              <p className="text-sm text-gray-500">Manage your privacy preferences</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
