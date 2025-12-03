'use client';

import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import Footer from './src/components/footter';
import ListChatting from './src/components/listChatting';
import Chatting from './src/components/chatting';
export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex flex-row h-full">
        <div className="w-[5%] bg-[#005ae0] flex flex-col justify-end items-center h-full space-y-4">
          <Footer></Footer>
        </div>
        <div className="w-[20%] flex-shrink-0 bg-white overflow-hidden border-r border-gray-200">
          <ListChatting />
        </div>
        <div className="w-[75%] bg-blue-200 flex flex-col justify-end  h-full space-y-4">
          <Chatting />
        </div>
      </div>
    </div>
  );
}
