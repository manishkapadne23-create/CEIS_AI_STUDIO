import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const [currentChatId, setCurrentChatId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("chat");

  const [selectedDomain, setSelectedDomain] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const location = useLocation();

  const currentChat =
    chats.find((chat) => chat.id === currentChatId) ?? null;

  const messages = currentChat?.messages ?? [];

  useEffect(() => {
    const storedDomainId = localStorage.getItem(
      "selectedEngineeringDomainId"
    );

    const storedDomainName = localStorage.getItem(
      "selectedEngineeringDomainName"
    );

    if (storedDomainId && storedDomainName) {
      setSelectedDomain({
        id: storedDomainId,
        name: storedDomainName,
      });
    } else {
      setSelectedDomain(null);
    }
  }, [location.key]);

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
    if (isLoading) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }

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
    if (isLoading) return;

    setCurrentChatId(chatId);
  };

  const sendMessageToAI = async (
    userMessage: string,
    chatId: string,
    addUserMessage = true
  ) => {
    if (isLoading) return;

    const targetChat =
      chats.find((chat) => chat.id === chatId) ?? null;

    if (!targetChat) return;

    const userMessageObject: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    const existingMessages = targetChat.messages;

    if (addUserMessage) {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

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
            messages: [
              ...chat.messages,
              userMessageObject,
            ],
          };
        })
      );
    }

    const history = existingMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
          body: JSON.stringify({
            message: userMessage,
            domainId: selectedDomain?.id ?? null,
            domainName: selectedDomain?.name ?? null,
            history,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `AI Server Error: ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.reply ??
          "The AI server returned an empty response.",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          return {
            ...chat,
            messages: [
              ...chat.messages,
              assistantMessage,
            ],
          };
        })
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        console.log("AI response stopped by user.");
        return;
      }

      console.error(error);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Unable to connect to AI Server. Please check that the backend and AI service are running.",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          return {
            ...chat,
            messages: [
              ...chat.messages,
              assistantMessage,
            ],
          };
        })
      );
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (
    userMessage: string
  ) => {
    if (!currentChatId || isLoading) return;

    await sendMessageToAI(
      userMessage,
      currentChatId,
      true
    );
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  };

  const handleClearChat = () => {
    if (!currentChatId || isLoading) return;

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;

        return {
          ...chat,
          title: "New Chat",
          messages: [],
        };
      })
    );
  };

  const handleQuickPrompt = (
    prompt: string
  ) => {
    if (!currentChatId || isLoading) return;

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
        {selectedDomain ? (
          <div className="border-b border-slate-800 bg-slate-900/70 px-5 py-3 text-sm text-slate-300">
            Active domain:{" "}
            <span className="font-semibold text-cyan-400">
              {selectedDomain.name}
            </span>
          </div>
        ) : null}

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
            onClearChat={handleClearChat}
                    />
        )}

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStop={handleStop}
        />
      </div>
    </div>
  );
};

export default ChatPage;