import React, { useState, useEffect } from 'react';
import { mockAIResponse } from '../services/mockAI';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import WelcomeScreen from '../components/WelcomeScreen';
import QuickPrompts from '../components/QuickPrompts';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  date: string;
  createdAt: Date;
}

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  // Create a new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      date: new Date().toLocaleDateString(),
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  // Select a chat
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  // Send message
  const handleSendMessage = async (userMessage: string) => {
    if (!currentChatId) return;

    // Add user message
    const userMsgId = Date.now().toString();

    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === currentChatId) {
          const newMessages = [
            ...chat.messages,
            {
              id: userMsgId,
              role: 'user' as const,
              content: userMessage,
              timestamp: new Date(),
            },
          ];

          // Update title if it's the first message
          const title =
            chat.messages.length === 0
              ? userMessage.split(' ').slice(0, 5).join(' ')
              : chat.title;

          return {
            ...chat,
            messages: newMessages,
            title: title.length > 30 ? title.substring(0, 30) + '...' : title,
          };
        }
        return chat;
      });

      return updatedChats;
    });

    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = mockAIResponse(userMessage);
      const aiMsgId = (Date.now() + 1).toString();

      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: aiMsgId,
                  role: 'assistant' as const,
                  content: aiResponse,
                  timestamp: new Date(),
                },
              ],
            };
          }
          return chat;
        });
      });

      setIsLoading(false);
    }, 1000);
  };

  // Handle quick prompt
  const handleQuickPrompt = (prompt: string) => {
    if (!currentChatId) {
      handleNewChat();
      setTimeout(() => {
        handleSendMessage(prompt);
      }, 100);
    } else {
      handleSendMessage(prompt);
    }
  };

  // Initialize first chat
  useEffect(() => {
    if (chats.length === 0) {
      handleNewChat();
    }
  }, []);

  const recentChats = chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    date: chat.date,
  }));

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId || undefined}
        recentChats={recentChats}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <>
            {/* Welcome Screen and Quick Prompts */}
            <WelcomeScreen onQuickPrompt={handleQuickPrompt} />
            <QuickPrompts onSelectPrompt={handleQuickPrompt} />
          </>
        ) : (
          <>
            {/* Chat Window */}
            <ChatWindow messages={messages} isLoading={isLoading} />
          </>
        )}

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatPage;
