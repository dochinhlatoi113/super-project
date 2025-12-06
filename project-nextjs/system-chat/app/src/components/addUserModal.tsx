import { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Avatar from './avatar';
import { chatService } from '../services/chatService';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
  type: 'admin' | 'user';
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userId: string) => void;
}

const AddUserModal = ({ isOpen, onClose, onAddUser }: AddUserModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState<string | null>(null);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // Gọi API get-all-admin để lấy danh sách admin
      const response = await chatService.getAllAdmins(token,searchQuery);
      const allAdmins = response.users || [];

      // Filter admins dựa trên search query
      const filteredAdmins = allAdmins.filter((admin: User) =>
        admin.fullName.toLowerCase().includes(query.toLowerCase()) ||
        admin.email.toLowerCase().includes(query.toLowerCase()) ||
        admin.username.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredAdmins);
    } catch (error) {
      console.error('Search admins error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleAddUser = async (userId: string, userName: string) => {
    setAddingUser(userId);
    try {
      await onAddUser(userId);
      onClose();
    } catch (error) {
      console.error('Add user error:', error);
    } finally {
      setAddingUser(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thêm Admin</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm admin theo tên, email hoặc username..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Đang tìm kiếm...
            </div>
          ) : searchResults.length === 0 && searchQuery ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy người dùng nào
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        alt={user.fullName}
                        size="md"
                        status="online"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {user.fullName}
                          {user.type === 'admin' && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                              Admin
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddUser(user._id, user.fullName)}
                      disabled={addingUser === user._id}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {addingUser === user._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang thêm...</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="h-4 w-4" />
                          <span>Thêm</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Nhập tên để tìm kiếm admin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;