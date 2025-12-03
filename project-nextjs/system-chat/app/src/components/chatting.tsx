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
import { useState } from 'react';

const Chatting = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col ">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-400 text-center">Start chatting...</p>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3 bg-white">
        {/* Top row - Action icons */}
        <div className="flex items-center gap-1 mb-2 px-1">
          <button className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
            <PlusCircleIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
            <PhotoIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
            <GifIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
            <FaceSmileIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
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
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="chatting..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
            />
          </div>

          {/* Emoji button inside input */}
          <button className="absolute right-16 p-1 text-blue-600 hover:bg-gray-200 rounded-full transition-colors">
            <FaceSmileIcon className="w-5 h-5" />
          </button>

          {/* Like or Send button */}
          {message.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-2 text-blue-600 hover:bg-gray-100 rounded-full transition-colors">
              <HandThumbUpIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Chatting;