"use client";

import { useState, useRef, useEffect } from "react";
import VoiceInput from "./VoiceInput";

interface ChatInputProps {
  onSend: (message: string, languageCode?: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (transcript: string, languageCode: string) => {
    onSend(transcript, languageCode);
  };

  return (
    <div className="sticky bottom-0 z-40 bg-[var(--surface)]/80 backdrop-blur-md border-t border-[var(--border-subtle)]">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any government scheme..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] font-body text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] resize-none disabled:opacity-50 transition-colors"
            />
          </div>

          <VoiceInput onTranscript={handleVoiceTranscript} disabled={disabled} />

          <button
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            className="w-11 h-11 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:hover:bg-[var(--accent)] shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
