"use client";

import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhotoIcon,
  GifIcon,
  MicrophoneIcon,
  PlusCircleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socketService';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  isRead: boolean;
}

interface ChattingProps {
  conversationId: string;
  participantName?: string;
}

const Chatting = ({ conversationId, participantName }: ChattingProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 7️⃣ Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !conversationId) return;

      // Lọc messages chưa đọc (không phải của mình)
      const unreadMessages = messages.filter(msg => !msg.isRead && msg.senderId !== user?.id);
      if (unreadMessages.length === 0) return;

      console.log('📖 Marking', unreadMessages.length, 'messages as read');

      // Update local state NGAY LẬP TỨC
      setMessages(prev => prev.map(msg => ({
        ...msg,
        isRead: msg.senderId !== user?.id ? true : msg.isRead  // ← UPDATE isRead = true
      })));

      // Optional: Gọi API để persist
      // await chatService.markAsRead(conversationId, token);

    } catch (error) {
      console.error('❌ Mark as read error:', error);
    }
  };

   
  // 1️⃣ Connect Socket.IO
  useEffect(() => {
    const connectSocket = async () => {
      try {
        console.log('🔌 Connecting to Socket.IO...');
        await socketService.connect();
        console.log('✅ Socket.IO connected successfully');
      } catch (error) {
        console.error('❌ Socket.IO connection failed:', error);
      }
    };

    connectSocket();

    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    return () => {
      clearInterval(interval);
      socketService.disconnect();
    };
  }, []);
  // 2️⃣ Load messages từ API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        console.log('📥 Loading messages...');
        const response = await chatService.getMessages(conversationId, token);
        
        if (response.success) {
          console.log('✅ Loaded', response.data.length, 'messages');
          setMessages(response.data);
          
          // ✅ MARK AS READ ngay sau khi load messages
          setTimeout(() => markMessagesAsRead(), 1000); // Delay 1s để user thấy messages trước
        }
      } catch (error) {
        console.error('❌ Load messages error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  // 3️⃣ Join room và listen events
  useEffect(() => {
    if (!socketService.isConnected() || !conversationId) return;

    console.log('🚪 Joining conversation:', conversationId);
    socketService.joinConversation(conversationId);

    // Listen new messages
    socketService.onNewMessage((newMessage: Message) => {
      console.log('📨 New message:', newMessage);
      if (newMessage.conversationId === conversationId) {
        setMessages(prev => {
          if (prev.some(m => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }
    });

    // Listen typing
    socketService.onTyping((data: any) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
        setTypingUser(data.userName || 'Someone');
        
        if (data.isTyping) {
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser('');
          }, 3000);
        }
      }
    });

    return () => {
      socketService.leaveConversation(conversationId);
      socketService.removeAllListeners();
    };
  }, [conversationId, user, isConnected]);

  // 4️⃣ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5️⃣ Send message
  const handleSend = () => {
    if (!message.trim() || !isConnected) return;

    console.log('📤 Sending:', message);
    socketService.sendMessage({
      conversationId,
      content: message,
      type: 'text'
    });

    setMessage('');
    socketService.emitTyping(conversationId, false);
  };

  // 6️⃣ Handle typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!isConnected) return;
    socketService.emitTyping(conversationId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitTyping(conversationId, false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-50 text-yellow-700 text-xs text-center border-b">
          ⚠️ Đang kết nối lại...
        </div>
      )}

      {/* Chat messages area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onClick={markMessagesAsRead}  // ← THÊM DÒNG NÀY
      >
        {loading ? (
          <div className="text-center text-gray-400">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">
            {participantName ? (
              <>
                Chưa có tin nhắn với <strong>{participantName}</strong>. Hãy bắt đầu trò chuyện!
              </>
            ) : (
              'Chưa có tin nhắn. Hãy bắt đầu trò chuyện!'
            )}
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {msg.senderName}
                    </p>
                  )}
                  <p className="text-sm break-words">{msg.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-600'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {isMe && (
                      <span className="text-[10px]">
                        {msg.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-2xl px-4 py-3">
              <p className="text-xs text-gray-600 mb-1">{typingUser} đang nhập...</p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3 bg-white">
        {/* Top row - Action icons */}
        <div className="flex items-center gap-1 mb-2 px-1">
          <button 
            className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Thêm"
          >
            <PlusCircleIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Ảnh"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Đính kèm"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            title="GIF"
          >
            <GifIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Emoji"
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Ghi âm"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <div className="flex-1"></div>
          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-sm">•••</span>
          </button>
        </div>

        {/* Bottom row - Input and send */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Aa" : "Đang kết nối..."}
              disabled={!isConnected}
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
            
            {/* Emoji button inside input */}
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-gray-200 rounded-full transition-colors"
              title="Emoji"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Like or Send button */}
          {message.trim() ? (
            <button
              onClick={handleSend}
              disabled={!isConnected}
              className="p-2 text-blue-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Gửi"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          ) : (
            <button 
              className="p-2 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Thích"
            >
              <HandThumbUpIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatting;