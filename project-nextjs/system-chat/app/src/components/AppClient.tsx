"use client";

import Footer from './footter';
import Chatting from './chatting';
import ListChatting from './listChatting';
import { useState } from 'react';

export default function AppClient() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedConversationName, setSelectedConversationName] = useState<string | null>(null);
  const [showFriendsView, setShowFriendsView] = useState<boolean>(false);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex flex-row h-full">
        <div className="w-[5%] bg-[#005ae0] flex flex-col items-center h-full">
          <Footer onOpenFriends={() => setShowFriendsView(true)} onOpenChat={() => setShowFriendsView(false)} />
        </div>
        <div className="w-[20%] flex-shrink-0 bg-white overflow-hidden border-r border-gray-200">
          <ListChatting
            onConversationSelect={(conversationId?: string, participantName?: string) => {
              setSelectedConversationId(conversationId || null);
              setSelectedConversationName(participantName || null);
            }}
            showFriends={showFriendsView}
            onCloseFriends={() => setShowFriendsView(false)}
          />
        </div>
        <div className="w-[75%] bg-blue-200 flex flex-col justify-end  h-full space-y-4">
          <Chatting
            conversationId={selectedConversationId || '6932e0ddbff0c73e7c9305b2'}
            participantName={selectedConversationName || undefined}
          />
        </div>
      </div>
    </div>
  );
}
