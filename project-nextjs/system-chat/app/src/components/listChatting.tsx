"use client";

import Avatar from './avatar';
import { BriefcaseIcon, ClockIcon, CalendarIcon, EllipsisHorizontalCircleIcon, UserPlusIcon, UsersIcon, PaperAirplaneIcon, BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { chatService as listFriendService } from '../services/listChattingService';
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
  onConversationSelect?: (conversationId: string, participantName?: string) => void;
  showFriends?: boolean;
  onCloseFriends?: () => void;
}

const ListChatting = ({ onConversationSelect, showFriends, onCloseFriends }: ListChattingProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingConversation, setCreatingConversation] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Load danh sách users khi component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load sent requests on mount so it's visible under search
  useEffect(() => {
    loadSentRequests();
  }, []);

  // Load friends when showFriends is toggled
  useEffect(() => {
    if (showFriends) {
      loadFriends();
      loadSentRequests();
    }
  }, [showFriends]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      // Prefer loading recent conversations (recent chats)
      const response = await chatService.getMyConversations(token);
      const payload = response?.data ?? response?.conversations ?? response ?? [];
      const arr = Array.isArray(payload) ? payload : [];

      const mapped = arr.map((conv: any) => {
        // Try common shapes: conv.participants (array), conv.participant, conv.user
        const participants = conv.participants || conv.users || conv.participantsList || [];
        let other: any = null;
        if (Array.isArray(participants) && participants.length > 0) {
          other = participants[0];
        }
        other = other || conv.participant || conv.user || conv.admin || conv.otherParticipant || conv;

        return {
          _id: conv._id || conv.id || other._id || other.id,
          username: other.username || other.name || other.fullName || '',
          email: other.email || '',
          fullName: other.fullName || other.name || other.username || other.email || 'Unknown',
          avatar: other.avatar || other.avatarUrl || other.photo || '',
          role: other.role || 'admin',
          type: 'admin'
        } as User;
      });

      setUsers(mapped || []);
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

  const [friendsList, setFriendsList] = useState<User[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [showPending, setShowPending] = useState(false);

  const loadFriends = async () => {
    try {
      setFriendsLoading(true);
      setFriendsError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setFriendsError('Please login first');
        return;
      }
      const response = await listFriendService.getAllFriend(token);
      const payload = response?.data ?? response?.users ?? response ?? [];
      const arr = Array.isArray(payload) ? payload : [];
      const mapped = arr.map((item: any) => {
        const friend = item.friend || item;
        return {
          _id: friend._id || friend.id,
          username: friend.username || friend.name || friend.fullName || '',
          email: friend.email || '',
          fullName: friend.fullName || friend.name || friend.username || '',
          avatar: friend.avatar || friend.avatarUrl || '',
          role: friend.role || 'admin',
          type: 'admin'
        } as User;
      });
      setFriendsList(mapped);
    } catch (err) {
      console.error('Load friends error:', err);
      setFriendsError(err instanceof Error ? err.message : 'Failed to load friends');
    } finally {
      setFriendsLoading(false);
    }
  };

  const loadSentRequests = async () => {
    try {
      setSentLoading(true);
      setSentError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setSentError('Please login first');
        return;
      }
      const res = await fetch('http://localhost:3000/api/friends/requests/sent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load sent requests');
      const data = await res.json();
      setSentRequests(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Load sent requests error:', err);
      setSentError(err instanceof Error ? err.message : 'Failed to load sent requests');
    } finally {
      setSentLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      setPendingLoading(true);
      setPendingError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setPendingError('Please login first');
        return;
      }
      const res = await fetch('http://localhost:3000/api/friends/requests/received', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load pending requests');
      const data = await res.json();
      setPendingRequests(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Load pending requests error:', err);
      setPendingError(err instanceof Error ? err.message : 'Failed to load pending requests');
    } finally {
      setPendingLoading(false);
    }
  };

  const acceptRequest = async (requesterId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');
      const res = await fetch('http://localhost:3000/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendId: requesterId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Accept failed');
      // refresh lists
      await Promise.all([loadFriends(), loadPendingRequests(), loadSentRequests()]);
    } catch (err) {
      console.error('Accept request error:', err);
      alert(err instanceof Error ? err.message : 'Failed to accept');
    }
  };

  const rejectRequest = async (requesterId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');
      const res = await fetch('http://localhost:3000/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendId: requesterId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reject failed');
      // refresh lists
      await Promise.all([loadFriends(), loadPendingRequests(), loadSentRequests()]);
    } catch (err) {
      console.error('Reject request error:', err);
      alert(err instanceof Error ? err.message : 'Failed to reject');
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

        onConversationSelect(conversationId, userName);
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
            <div className="flex items-center justify-start gap-6 overflow-x-auto flex-nowrap py-2 px-1">
              <button
                onClick={handleAddUserClick}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                style={{ minWidth: 56 }}
              >
                <UserPlusIcon className="h-6 w-6" />
                <span className="text-[12px] text-center leading-tight">Add<br/>Admin</span>
              </button>

              <button className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" style={{ minWidth: 56 }}>
                <UsersIcon className="h-6 w-6" />
                <span className="text-[12px] text-center leading-tight">Add<br/>Group<br/>Chat</span>
              </button>

              <button
                onClick={() => {
                  const next = !showPending;
                  setShowPending(next);
                  if (next) loadPendingRequests();
                }}
                className="flex-shrink-0 relative flex flex-col items-center gap-1 px-2 py-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                style={{ minWidth: 56 }}
              >
                <BellIcon className="h-6 w-6" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-[11px] bg-red-500 text-white rounded-full px-2 py-0.5">{pendingRequests.length}</span>
                )}
                <span className="text-[12px] text-center">Lời<br/>mời</span>
              </button>
            </div>
        </div>
        {/* Sent requests shown under search */}
        <div className="mt-3 px-2">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Lời mời đã gửi</h2>
          {sentLoading && <div className="text-sm text-gray-500">Loading sent requests...</div>}
          {sentError && <div className="text-sm text-red-500">{sentError}</div>}
          {!sentLoading && sentRequests.length === 0 && (
            <div className="text-sm text-gray-500">Bạn chưa gửi lời mời nào.</div>
          )}
          <div className="space-y-2">
            {sentRequests.map((req) => {
              const friend = req.friend || req.friendId || req;
              return (
                <div key={req._id} className="px-3 py-2 flex items-center justify-between bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar src={friend.avatar || ''} alt={friend.fullName || friend.name || ''} size="sm" status="offline" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{friend.fullName || friend.name || friend.email}</div>
                      <div className="text-xs text-gray-500">Đã gửi: {new Date(req.requestedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                      <PaperAirplaneIcon className="h-4 w-4" />
                      <span className="text-xs">Đã gửi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending requests (received) - toggleable */}
        {showPending && (
          <div className="mt-3 px-2">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Lời mời nhận được</h2>
            {pendingLoading && <div className="text-sm text-gray-500">Loading pending requests...</div>}
            {pendingError && <div className="text-sm text-red-500">{pendingError}</div>}
            {!pendingLoading && pendingRequests.length === 0 && (
              <div className="text-sm text-gray-500">Bạn chưa có lời mời nào.</div>
            )}
            <div className="space-y-2">
              {pendingRequests.map((req) => {
                const user = req.user || req.userId || req.userId || req.user || req;
                const requester = req.user || req.userId || req.user || req;
                const friend = requester.friend || requester || req.user || req.userId || req;
                const name = (req.user && (req.user.fullName || req.user.name)) || (req.userId && req.userId.fullName) || req.requesterName || (friend && (friend.fullName || friend.name)) || 'Người dùng';
                const requesterId = (req.user && req.user._id) || (req.userId && req.userId._id) || req.userId || req.user || req.userId || (req.user && req.user.id) || (req.userId && req.userId.id);
                return (
                  <div key={req._id} className="px-3 py-2 flex items-center justify-between bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar src={(req.user && req.user.avatar) || ''} alt={name} size="sm" status="offline" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{name}</div>
                        <div className="text-xs text-gray-500">Gửi: {new Date(req.requestedAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => acceptRequest(requesterId)} className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100">
                        <CheckIcon className="h-4 w-4" />
                        <span className="text-xs">Chấp nhận</span>
                      </button>
                      <button onClick={() => rejectRequest(requesterId)} className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">
                        <XMarkIcon className="h-4 w-4" />
                        <span className="text-xs">Từ chối</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <hr></hr>
      <div className="">
       <div className="flex items-center justify-between px-4 py-2">
            <h1 className=" py-2 font-semibold text-gray-700">
              {showFriends ? 'Danh sách bạn bè' : 'Trò chuyện gần đây'}
            </h1>
            <div className="flex items-center gap-2">
              {showFriends ? (
                <button onClick={() => onCloseFriends && onCloseFriends()} className="text-sm text-gray-500">Đóng</button>
              ) : (
                <EllipsisHorizontalCircleIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
        </div>

        {showFriends ? (
          <div className="p-2">
            {friendsLoading && <div className="text-sm text-gray-500">Loading...</div>}
            {friendsError && <div className="text-sm text-red-500">{friendsError}</div>}
            {!friendsLoading && !friendsError && friendsList.length === 0 && (
              <div className="text-sm text-gray-500">Không có bạn bè nào.</div>
            )}

            <div className="space-y-2">
              {friendsList.map((user) => (
                <div
                  key={user._id}
                  className={`px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    creatingConversation === user._id ? 'opacity-50' : ''
                  }`}
                  onClick={() => handleUserClick(user._id, user.fullName)}
                >
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex-shrink-0">
                      <Avatar src={user.avatar} alt={user.fullName} size="lg" status="online" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-[15px] font-semibold text-gray-800">{user.fullName}</h1>
                      <div className="text-[13px] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{user.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-600 mb-2">Lời mời đã gửi</h2>
              {sentLoading && <div className="text-sm text-gray-500">Loading sent requests...</div>}
              {sentError && <div className="text-sm text-red-500">{sentError}</div>}
              {!sentLoading && sentRequests.length === 0 && (
                <div className="text-sm text-gray-500">Bạn chưa gửi lời mời nào.</div>
              )}
              <div className="space-y-2">
                {sentRequests.map((req) => {
                  const friend = req.friend || req.friendId || req;
                  return (
                    <div key={req._id} className="px-3 py-2 flex items-center justify-between bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar src={friend.avatar || ''} alt={friend.fullName || friend.name || ''} size="sm" status="offline" />
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{friend.fullName || friend.name || friend.email}</div>
                          <div className="text-xs text-gray-500">Đã gửi: {new Date(req.requestedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                          <PaperAirplaneIcon className="h-4 w-4" />
                          <span className="text-xs">Đã gửi</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            {(!users || users.length === 0) ? (
              <div className="p-4 text-center text-gray-500">Chưa có cuộc trò chuyện. Hãy bắt đầu trò chuyện!</div>
            ) : (
                <div>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">Bạn mới</h3>
                  </div>
                  <div className="divide-y">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          creatingConversation === user._id ? 'opacity-50' : ''
                        }`}
                        onClick={() => handleUserClick(user._id, user.fullName)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar src={user.avatar} alt={user.fullName} size="lg" status="online" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{user.fullName}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <EllipsisHorizontalCircleIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}
          </>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onFriendAdded={() => { loadFriends(); }}
        onConversationCreated={(conversationId?: string, participantName?: string) => {
          // Forward to parent selector so AppClient can open the chat and show name
          if (onConversationSelect && conversationId) {
            onConversationSelect(conversationId, participantName);
            setShowAddUserModal(false);
          }
        }}
      />
    </div>
  );
};

export default ListChatting;
