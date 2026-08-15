import React, { useEffect, useRef } from "react";

import Message from "./Message";

import type { ChatMessage } from "../types/chatMessage";

import type { EngineeringActionResult } from "../actions";



interface ChatWindowProps {

  messages: ChatMessage[];

  isLoading: boolean;

  conversationId?: string;

  onClearChat?: () => void;

  onActionResult?: (result: EngineeringActionResult) => void;

}



const ChatWindow: React.FC<ChatWindowProps> = ({

  messages,

  isLoading,

  conversationId,

  onClearChat,

  onActionResult,

}) => {

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    const container = scrollContainerRef.current;



    if (!container) {

      return;

    }



    container.scrollTo({

      top: container.scrollHeight,

      behavior: messages.length > 0 ? "smooth" : "auto",

    });

  }, [messages, isLoading]);



  const isEmpty = messages.length === 0;



  return (

    <div

      ref={scrollContainerRef}

      className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-950"

      aria-label="Chat conversation"

    >

      <div

        className={`mx-auto w-full max-w-5xl px-4 py-3 sm:px-6 sm:py-4 ${

          isEmpty ? "flex min-h-full items-center justify-center" : ""

        }`}

      >

        {!isEmpty && onClearChat ? (

          <div className="mb-3 flex justify-end">

            <button

              type="button"

              onClick={onClearChat}

              disabled={isLoading}

              className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-500 transition hover:bg-slate-800 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"

            >

              Clear

            </button>

          </div>

        ) : null}



        {isEmpty ? null : (

          <>

            {messages.map((message) => (

              <Message

                key={message.id}

                message={message}

                conversationId={conversationId}

                onActionResult={onActionResult}

              />

            ))}



            {isLoading ? (

              <div className="mb-6 flex gap-3">

                <div className="shrink-0">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/80 to-blue-600/80">

                    <span className="text-[10px] font-bold text-white">S</span>

                  </div>

                </div>

                <div className="max-w-2xl">

                  <div className="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100">

                    <div className="flex items-center gap-2">

                      <div className="flex gap-1">

                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

                        <div className="animation-delay-200 h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

                        <div className="animation-delay-400 h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />

                      </div>

                      <span className="text-sm text-slate-400">Thinking...</span>

                    </div>

                  </div>

                </div>

              </div>

            ) : null}



            <div ref={messagesEndRef} aria-hidden="true" />

          </>

        )}

      </div>

    </div>

  );

};



export default ChatWindow;
