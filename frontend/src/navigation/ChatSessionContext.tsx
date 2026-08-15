import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import type { ChatMessage } from "../types/chatMessage";
import { PERSISTED_KEYS, readPersistedString, writePersistedString } from "../utils/persistedState";
import { getChatRouteFromWorkspace } from "./disciplineSlugs";
import { requestChatInputFocus } from "./events";

export interface ChatEngineeringContext {
  disciplineId: string | null;
  disciplineName: string | null;
  specializationId: string | null;
  specializationName: string | null;
}

export interface StoredChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  date: string;
  createdAt: string;
  engineeringContext?: ChatEngineeringContext;
}

interface ChatSessionContextValue {
  chats: StoredChat[];
  currentChatId: string | null;
  recentChats: { id: string; title: string; date: string }[];
  setChats: React.Dispatch<React.SetStateAction<StoredChat[]>>;
  setCurrentChatId: (chatId: string | null) => void;
  startNewChat: () => void;
  selectChat: (chatId: string) => void;
  updateChatMessages: (chatId: string, updater: (messages: ChatMessage[]) => ChatMessage[]) => void;
  updateChatMeta: (
    chatId: string,
    updater: (chat: StoredChat) => StoredChat
  ) => void;
}

const ChatSessionContext = createContext<ChatSessionContextValue | null>(null);

const deserializeChats = (raw: string | null): StoredChat[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredChat[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((chat) => ({
      ...chat,
      messages: chat.messages.map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      })),
    }));
  } catch {
    return [];
  }
};

const createChat = (): StoredChat => ({
  id: crypto.randomUUID(),
  title: "New Chat",
  messages: [],
  date: new Date().toLocaleDateString(),
  createdAt: new Date().toISOString(),
});

export const ChatSessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<StoredChat[]>(() =>
    deserializeChats(readPersistedString(PERSISTED_KEYS.chatSessions))
  );
  const [currentChatId, setCurrentChatIdState] = useState<string | null>(() =>
    readPersistedString(PERSISTED_KEYS.currentChatId)
  );

  useEffect(() => {
    writePersistedString(PERSISTED_KEYS.chatSessions, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      writePersistedString(PERSISTED_KEYS.currentChatId, currentChatId);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (chats.length === 0) {
      const firstChat = createChat();
      setChats([firstChat]);
      setCurrentChatIdState(firstChat.id);
    } else if (!currentChatId || !chats.some((chat) => chat.id === currentChatId)) {
      setCurrentChatIdState(chats[0].id);
    }
  }, [chats, currentChatId]);

  const setCurrentChatId = useCallback((chatId: string | null) => {
    setCurrentChatIdState(chatId);
    if (chatId) {
      writePersistedString(PERSISTED_KEYS.currentChatId, chatId);
    }
  }, []);

  const startNewChat = useCallback(() => {
    const newChat = createChat();
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    navigate(getChatRouteFromWorkspace());
    window.setTimeout(() => requestChatInputFocus(), 100);
  }, [navigate, setCurrentChatId]);

  const selectChat = useCallback(
    (chatId: string) => {
      setCurrentChatId(chatId);
      navigate(getChatRouteFromWorkspace());
      window.setTimeout(() => requestChatInputFocus(), 100);
    },
    [navigate, setCurrentChatId]
  );

  const updateChatMessages = useCallback(
    (chatId: string, updater: (messages: ChatMessage[]) => ChatMessage[]) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: updater(chat.messages) }
            : chat
        )
      );
    },
    []
  );

  const updateChatMeta = useCallback(
    (chatId: string, updater: (chat: StoredChat) => StoredChat) => {
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? updater(chat) : chat))
      );
    },
    []
  );

  const recentChats = useMemo(
    () =>
      chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        date: chat.date,
      })),
    [chats]
  );

  const value = useMemo(
    () => ({
      chats,
      currentChatId,
      recentChats,
      setChats,
      setCurrentChatId,
      startNewChat,
      selectChat,
      updateChatMessages,
      updateChatMeta,
    }),
    [
      chats,
      currentChatId,
      recentChats,
      startNewChat,
      selectChat,
      updateChatMessages,
      updateChatMeta,
      setCurrentChatId,
    ]
  );

  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSession = (): ChatSessionContextValue => {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error("useChatSession must be used within ChatSessionProvider");
  }
  return context;
};
