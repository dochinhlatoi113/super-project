"use client";

import { io, Socket } from 'socket.io-client';
import { authService } from './authService';

// Define interfaces for type safety
interface MessageData {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'audio';
}

interface TypingData {
  conversationId: string;
  isTyping: boolean;
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  async connect(): Promise<Socket> {
 
    if (this.socket?.connected) {
      console.log('✅ Already connected');
      return this.socket;
    }

    console.log('🔌 Connecting to Socket.IO server...');
    
    // Get valid token (refresh if needed)
    const token = await authService.getValidToken();
    if (!token) {
      throw new Error('No valid authentication token available');
    }
    
    this.socket = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connectedaaa:', this.socket);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('🔴 Connection error:', error.message);
    });
    this.socket.on('error', (error: Error) =>  {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      console.log('👋 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  joinConversation(conversationId: string): void {
    console.log('🚪 Joining conversation:', conversationId);
    this.socket?.emit('joinConversation', conversationId);
  }

  leaveConversation(conversationId: string): void {
    console.log('👋 Leaving conversation:', conversationId);
    this.socket?.emit('leaveConversation', conversationId);
  }

  sendMessage(data: MessageData): void {
    console.log('📤 Sending message:', data);
    this.socket?.emit('sendMessage', data);
  }

  onNewMessage(callback: (message: any) => void): void {
    console.log('👂 Listening for new messages');
    this.socket?.on('newMessage', callback);
    this.addListener('newMessage', callback);
  }

  onTyping(callback: (data: any) => void): void {
    this.socket?.on('userTyping', callback);
    this.addListener('userTyping', callback);
  }

  emitTyping(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { conversationId, isTyping } as TypingData);
  }

  onConversationUpdated(callback: (data: any) => void): void {
    this.socket?.on('conversationUpdated', callback);
    this.addListener('conversationUpdated', callback);
  }

  onMessagesRead(callback: (data: any) => void): void {
    this.socket?.on('messagesRead', callback);
    this.addListener('messagesRead', callback);
  }

  private addListener(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.push(callback);
    }
  }

  removeAllListeners(): void {
    console.log('🧹 Removing all listeners');
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(cb => this.socket?.off(event, cb as any));
    });
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton instance
export const socketService = new SocketService();