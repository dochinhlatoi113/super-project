"use client";

import { useAuth } from '../context/AuthContext';
import Avatar from './avatar';
import { UsersIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Props {
  onOpenFriends?: () => void;
  onOpenChat?: () => void;
}

const Footter = ({ onOpenFriends, onOpenChat }: Props) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col justify-between items-center h-full py-4 w-full">
      <div className="mt-2 flex flex-col items-center gap-2">
        <button
          aria-label="Danh bạ"
          title="Danh bạ"
          onClick={() => onOpenFriends && onOpenFriends()}
          className="p-2 rounded-full hover:bg-indigo-600/20"
        >
          <UsersIcon className="h-5 w-5 text-white" />
        </button>

        <button
          aria-label="Tin nhắn"
          title="Tin nhắn"
          onClick={() => onOpenChat && onOpenChat()}
          className="p-2 rounded-full hover:bg-indigo-600/20"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="mb-2">
        <Avatar name={user?.email || 'Guest'} />
      </div>
    </div>
  );
};

export default Footter;
