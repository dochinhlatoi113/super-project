import Avatar from './avatar';
import { BriefcaseIcon, ClockIcon, CalendarIcon, EllipsisHorizontalCircleIcon, UserPlusIcon , UsersIcon} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import AddUserModal from './addUserModal';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
  type: 'admin' | 'user';
}

interface ListChattingProps {
  onConversationSelect?: (conversationId: string) => void;
}

const ListChatting = ({ onConversationSelect }: ListChattingProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingConversation, setCreatingConversation] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Load danh sách users khi component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await chatService.getChatUsers(token);
      setUsers(response.users || []);
    } catch (err) {
      console.error('Load users error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userId: string) => {
    // Tạo conversation với admin được chọn
    await handleUserClick(userId, 'New Admin');
  };

  const handleAddUserClick = () => {
    setShowAddUserModal(true);
  };

  const handleUserClick = async (participantId: string, userName: string) => {
    if (!onConversationSelect) return;

    setCreatingConversation(participantId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      console.log(`🔄 Creating conversation with ${userName} (${participantId})`);

      const response = await chatService.createConversation(participantId, token);

      if (response.success && response.conversation) {
        const conversationId = response.conversation._id;
        console.log('✅ Conversation created:', conversationId);

        onConversationSelect(conversationId);
      } else {
        console.error('❌ Failed to create conversation:', response.message);
        alert('Failed to create conversation: ' + response.message);
      }
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      alert('Error creating conversation');
    } finally {
      setCreatingConversation(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <button
          onClick={loadUsers}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className = "px-2 py-2">
        <input
          type="text"
          placeholder="Tìm kiếm trò chuyện..."
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
        />
         <div className="flex items-center justify-between px-2 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddUserClick}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <UserPlusIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Add Admin</span>
              </button>
              <button className="flex items-center gap-2  text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <UsersIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Add Group Chat</span>
              </button>
            </div>
        </div>
      </div>
      <hr></hr>
      <div className="">
       <div className="flex items-center justify-between px-4 py-2">
            <h1 className=" py-2 font-semibold text-gray-700">Trò chuyện gần đây</h1>
            <EllipsisHorizontalCircleIcon className="h-6 w-6 text-gray-500" />
        </div>
        {users.map((user) => (
          <div
            key={user._id}
            className={`px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              creatingConversation === user._id ? 'opacity-50' : ''
            }`}
            onClick={() => handleUserClick(user._id, user.fullName)}
          >
            <div className="flex flex-row items-center gap-3">
              <div className="flex-shrink-0">
                <Avatar
                  src={user.avatar}
                  alt={user.fullName}
                  size="lg"
                  status="online"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[15px] font-semibold text-gray-800">
                  {user.fullName}
                </h1>
                <div className="text-[13px] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.email}
                  {creatingConversation === user._id && (
                    <span className="ml-2 text-blue-500">Creating...</span>
                  )}
                </div>
              </div>
              <div className="">
                  <button className="px-3 py-2 bg-red-500 text-white-600 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      Xoá
                  </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 px-2 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <div className="flex flex-col items-center gap-1">
                <BriefcaseIcon className="w-4 h-4 text-indigo-600" />
                <p className="text-[11px] font-medium text-gray-700">work</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <p className="text-[11px] font-medium text-gray-700">11:30</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CalendarIcon className="w-4 h-4 text-purple-600" />
                <p className="text-[11px] font-medium text-gray-700">20-11-2024</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default ListChatting;
