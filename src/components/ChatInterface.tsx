"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import RTIDraftModal from "./RTIDraftModal";

interface ChatInterfaceProps {
  selectedLanguage: string;
}

export default function ChatInterface({ selectedLanguage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rtiModal, setRtiModal] = useState<{ schemeId: string; context: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string, voiceLanguageCode?: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          languageCode: voiceLanguageCode || selectedLanguage,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        languageCode: data.languageCode,
        languageName: data.languageName,
        schemeIds: data.schemeIds,
        schemeNames: data.schemeNames,
        isGrievance: data.isGrievance,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Send error:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        languageName: "System",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (question: string) => {
    sendMessage(question);
  };

  const handleRTIClick = (schemeId: string, content: string) => {
    setRtiModal({ schemeId, context: content });
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-57px)]">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide">
        {messages.length === 0 ? (
          <WelcomeScreen onExampleClick={handleExampleClick} languageCode={selectedLanguage} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRTIClick={handleRTIClick}
              />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="msg-assistant px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                    <span className="text-xs font-body text-[var(--text-muted)]">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />

      {/* RTI Modal */}
      {rtiModal && (
        <RTIDraftModal
          schemeId={rtiModal.schemeId}
          issueContext={rtiModal.context}
          onClose={() => setRtiModal(null)}
        />
      )}
    </div>
  );
}
