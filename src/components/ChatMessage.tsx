"use client";

import { useState } from "react";
import AudioPlayback from "./AudioPlayback";
import SourceAttribution from "./SourceAttribution";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  languageCode?: string;
  languageName?: string;
  schemeIds?: string[];
  schemeNames?: string[];
  isGrievance?: boolean;
  sources?: { name: string; url: string; helpline: string }[];
}

interface ChatMessageProps {
  message: Message;
  onRTIClick?: (schemeId: string, content: string) => void;
}

export default function ChatMessage({ message, onRTIClick }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}
    >
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? "msg-user" : "msg-assistant"} px-4 py-3`}>
        {/* Language badge */}
        {!isUser && message.languageName && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.12em] font-body font-medium text-[var(--accent)] bg-[var(--accent-bg)] px-2 py-0.5 rounded-full">
              {message.languageName}
            </span>
            {message.schemeNames && message.schemeNames.length > 0 && (
              <span className="text-[10px] font-body text-[var(--text-muted)]">
                {message.schemeNames.join(", ")}
              </span>
            )}
          </div>
        )}

        {/* Message content */}
        <div
          className={`font-body text-[15px] leading-relaxed whitespace-pre-wrap ${
            isUser ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
          }`}
        >
          {expanded || message.content.length <= 500
            ? message.content
            : message.content.slice(0, 500) + "..."}
          {message.content.length > 500 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-[var(--accent)] text-sm font-medium hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Action bar for assistant messages */}
        {!isUser && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* TTS Play button */}
            <AudioPlayback
              text={message.content}
              languageCode={message.languageCode || "en-IN"}
            />

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <SourceAttribution sources={message.sources} />
            )}

            {/* RTI button */}
            {message.isGrievance && message.schemeIds && message.schemeIds.length > 0 && (
              <button
                onClick={() =>
                  onRTIClick?.(message.schemeIds![0], message.content)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium bg-[var(--warm-50)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Draft RTI
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
