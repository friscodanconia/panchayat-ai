"use client";

import { useState, useRef } from "react";
import { AudioRecorder } from "@/lib/audioRecorder";
import { unlockAudio } from "@/lib/audioContext";

interface VoiceInputProps {
  onTranscript: (text: string, languageCode: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const handleToggle = async () => {
    if (disabled) return;
    unlockAudio();

    if (isRecording) {
      // Stop recording
      if (recorderRef.current) {
        setIsProcessing(true);
        try {
          const blob = await recorderRef.current.stop();
          const formData = new FormData();
          formData.append("audio", blob, "audio.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.transcript) {
              onTranscript(data.transcript, data.languageCode || "unknown");
            }
          }
        } catch (err) {
          console.error("Voice input error:", err);
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
        }
      }
    } else {
      // Start recording
      recorderRef.current = new AudioRecorder();
      try {
        await recorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic access denied:", err);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isProcessing}
      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all ${
        isRecording
          ? "bg-[var(--error)] text-white recording-pulse"
          : isProcessing
            ? "bg-[var(--warm-200)] text-[var(--text-muted)]"
            : "bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      } disabled:opacity-40`}
      title={isRecording ? "Stop recording" : "Start recording"}
    >
      {isProcessing ? (
        <div className="flex gap-0.5">
          <div className="typing-dot" style={{ width: 4, height: 4 }} />
          <div className="typing-dot" style={{ width: 4, height: 4 }} />
          <div className="typing-dot" style={{ width: 4, height: 4 }} />
        </div>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          {isRecording ? (
            <rect x="6" y="6" width="12" height="12" rx="2" />
          ) : (
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
          )}
        </svg>
      )}
    </button>
  );
}
