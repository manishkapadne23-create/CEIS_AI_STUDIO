import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";
import QuickPrompts from "../components/QuickPrompts";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
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
  const [activeMenu, setActiveMenu] = useState("chat");

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) ?? null;

  const messages = currentChat?.messages ?? [];

  useEffect(() => {
    if (chats.length === 0) {
      const firstChat: Chat = {
        id: crypto.randomUUID(),
        title: "New Chat",
        messages: [],
        date: new Date().toLocaleDateString(),
        createdAt: new Date(),
      };

      setChats([firstChat]);
      setCurrentChatId(firstChat.id);
    }
  }, []);

  const handleNewChat = () => {

    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      date: new Date().toLocaleDateString(),
      createdAt: new Date(),
    };

    setChats((prev) => [newChat, ...prev]);

    setCurrentChatId(newChat.id);

  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleSendMessage = async (userMessage: string) => {

    if (!currentChatId) return;

    const userMessageObject: ChatMessage = {

      id: crypto.randomUUID(),

      role: "user",

      content: userMessage,

      timestamp: new Date(),

    };

    setChats((prev) =>
      prev.map((chat) => {

        if (chat.id !== currentChatId) return chat;

        const updatedMessages = [
          ...chat.messages,
          userMessageObject,
        ];

        let title = chat.title;

        if (chat.messages.length === 0) {

          title = userMessage
            .split(" ")
            .slice(0, 5)
            .join(" ");

          if (title.length > 35) {

            title = title.substring(0, 35) + "...";

          }

        }

        return {

          ...chat,

          title,

          messages: updatedMessages,

        };

      })
    );

    setIsLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      if (!response.ok) {

        throw new Error("Server Error");

      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {

        id: crypto.randomUUID(),

        role: "assistant",

        content: data.reply,

        timestamp: new Date(),

      };

      setChats((prev) =>
        prev.map((chat) => {

          if (chat.id !== currentChatId) return chat;

          return {

            ...chat,

            messages: [
              ...chat.messages,
              assistantMessage,
            ],

          };

        })
      );

    } catch (err) {

      const assistantMessage: ChatMessage = {

        id: crypto.randomUUID(),

        role: "assistant",

        content:
          "Unable to connect to AI Server.",

        timestamp: new Date(),

      };

      setChats((prev) =>
        prev.map((chat) => {

          if (chat.id !== currentChatId) return chat;

          return {

            ...chat,

            messages: [
              ...chat.messages,
              assistantMessage,
            ],

          };

        })
      );

      console.error(err);

    } finally {

      setIsLoading(false);

    }

  };
// Handle Quick Prompt
  const handleQuickPrompt = (prompt: string) => {

    if (!currentChatId) {

      const newChat: Chat = {

        id: crypto.randomUUID(),

        title: "New Chat",

        messages: [],

        date: new Date().toLocaleDateString(),

        createdAt: new Date(),

      };

      setChats((prev) => [newChat, ...prev]);

      setCurrentChatId(newChat.id);

      setTimeout(() => {

        handleSendMessage(prompt);

      }, 100);

      return;

    }

    handleSendMessage(prompt);

  };

  const recentChats = chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    date: chat.date,
  }));

  return (

    <div className="flex h-screen bg-slate-950">

      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId ?? undefined}
        recentChats={recentChats}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        {messages.length === 0 ? (

          <>

            <WelcomeScreen
              onQuickPrompt={handleQuickPrompt}
            />

            <QuickPrompts
              onSelectPrompt={handleQuickPrompt}
            />

          </>

        ) : (

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
          />

        )}

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />

      </div>

    </div>

  );

};

export default ChatPage;
