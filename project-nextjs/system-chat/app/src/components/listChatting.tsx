import Avatar from './avatar';
import { BriefcaseIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
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

interface ListChattingProps {
  onConversationSelect?: (conversationId: string) => void;
}

const ListChatting = ({ onConversationSelect }: ListChattingProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingConversation, setCreatingConversation] = useState<string | null>(null);

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
    <div className="divide-y divide-gray-100">
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
                {user.type === 'admin' && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                    Admin
                  </span>
                )}
              </h1>
              <div className="text-[13px] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                {user.email}
                {creatingConversation === user._id && (
                  <span className="ml-2 text-blue-500">Creating...</span>
                )}
              </div>
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
  );
};

export default ListChatting;
