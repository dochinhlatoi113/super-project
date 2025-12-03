import { useState } from 'react';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderType: 'customer' | 'sales';
  text: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  salesPerson: string;
  status: 'active' | 'waiting' | 'closed';
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');

  const conversations: Conversation[] = [
    { id: 1, customerName: 'John Doe', customerAvatar: 'JD', lastMessage: 'Tôi muốn hỏi về sản phẩm...', lastMessageTime: '2 min ago', unreadCount: 3, salesPerson: 'Alice', status: 'active' },
    { id: 2, customerName: 'Jane Smith', customerAvatar: 'JS', lastMessage: 'Cảm ơn bạn đã hỗ trợ', lastMessageTime: '15 min ago', unreadCount: 0, salesPerson: 'Bob', status: 'active' },
    { id: 3, customerName: 'Bob Johnson', customerAvatar: 'BJ', lastMessage: 'Khi nào giao hàng?', lastMessageTime: '1 hour ago', unreadCount: 1, salesPerson: 'Alice', status: 'waiting' },
    { id: 4, customerName: 'Alice Brown', customerAvatar: 'AB', lastMessage: 'Đơn hàng đã nhận rồi', lastMessageTime: '3 hours ago', unreadCount: 0, salesPerson: 'Charlie', status: 'closed' },
    { id: 5, customerName: 'Charlie Wilson', customerAvatar: 'CW', lastMessage: 'Có mã giảm giá không?', lastMessageTime: '1 day ago', unreadCount: 5, salesPerson: 'Bob', status: 'waiting' },
  ];

  const messages: Message[] = [
    { id: 1, senderId: 1, senderName: 'John Doe', senderType: 'customer', text: 'Xin chào, tôi muốn hỏi về sản phẩm Laptop Pro 15"', timestamp: '10:30 AM', isRead: true },
    { id: 2, senderId: 2, senderName: 'Alice (Sales)', senderType: 'sales', text: 'Chào bạn! Tôi có thể giúp gì cho bạn về sản phẩm này?', timestamp: '10:31 AM', isRead: true },
    { id: 3, senderId: 1, senderName: 'John Doe', senderType: 'customer', text: 'Sản phẩm này còn hàng không? Và có khuyến mãi gì không ạ?', timestamp: '10:32 AM', isRead: true },
    { id: 4, senderId: 2, senderName: 'Alice (Sales)', senderType: 'sales', text: 'Dạ sản phẩm vẫn còn hàng. Hiện tại đang có chương trình giảm 10% cho khách hàng mới.', timestamp: '10:33 AM', isRead: true },
    { id: 5, senderId: 1, senderName: 'John Doe', senderType: 'customer', text: 'Vậy tôi có thể đặt hàng ngay được không?', timestamp: '10:35 AM', isRead: false },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Logic gửi tin nhắn
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'waiting': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'waiting': return 'Waiting';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Danh sách cuộc hội thoại */}
      <div className="w-96 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg">All</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Active</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Waiting</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Closed</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                selectedConversation === conv.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {conv.customerAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">{conv.customerName}</h3>
                    {conv.unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(conv.status)}`}>
                        {getStatusText(conv.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Sales: {conv.salesPerson}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khung chat */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">John Doe</h3>
                    <p className="text-sm text-gray-500">Customer ID: #12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm">
                    View Profile
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm">
                    View Orders
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'sales' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      msg.senderType === 'sales'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderType === 'sales' ? 'text-indigo-200' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Send
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <button className="text-sm text-gray-600 hover:text-indigo-600 transition">
                  Quick Replies
                </button>
                <button className="text-sm text-gray-600 hover:text-indigo-600 transition">
                  Templates
                </button>
                <button className="text-sm text-gray-600 hover:text-indigo-600 transition">
                  Send Product
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Thông tin khách hàng */}
      <div className="w-80 bg-white rounded-xl shadow-sm overflow-hidden">
        {selectedConversation ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                JD
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">John Doe</h3>
              <p className="text-sm text-gray-500">john.doe@example.com</p>
              <p className="text-sm text-gray-500">+1 234 567 890</p>
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Customer Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Orders:</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Spent:</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since:</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">VIP</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Assigned Sales</h4>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Alice</p>
                    <p className="text-xs text-gray-500">alice@company.com</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Recent Orders</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">#ORD-1001</span>
                      <span className="text-gray-500">$299</span>
                    </div>
                    <p className="text-xs text-gray-500">Laptop Pro 15"</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">#ORD-0998</span>
                      <span className="text-gray-500">$49</span>
                    </div>
                    <p className="text-xs text-gray-500">Wireless Mouse</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Notes</h4>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add notes about this customer..."
                ></textarea>
                <button className="w-full mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No customer selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
