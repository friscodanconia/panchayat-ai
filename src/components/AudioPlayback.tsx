"use client";

import { useState } from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { playBase64Audio, unlockAudio } from "@/lib/audioContext";

interface AudioPlaybackProps {
  text: string;
  languageCode: string;
}

export default function AudioPlayback({ text, languageCode }: AudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    if (isPlaying || isLoading) return;

    unlockAudio();
    setIsLoading(true);

    try {
      const lang = SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES["en-IN"];
      // Truncate text for TTS (API limit)
      const ttsText = text.length > 500 ? text.slice(0, 500) : text;

      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ttsText,
          targetLang: languageCode,
          voice: lang.voice,
        }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const data = await res.json();
      if (data.audio) {
        setIsPlaying(true);
        await playBase64Audio(data.audio);
      }
    } catch (err) {
      console.error("Playback error:", err);
    } finally {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium bg-[var(--accent-bg)] border border-[var(--border-accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <div className="flex gap-0.5">
            <div className="typing-dot" style={{ width: 4, height: 4 }} />
            <div className="typing-dot" style={{ width: 4, height: 4 }} />
            <div className="typing-dot" style={{ width: 4, height: 4 }} />
          </div>
          Loading
        </>
      ) : isPlaying ? (
        <>
          <div className="flex items-end gap-[2px] h-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-current"
                style={{
                  animation: `dot-bounce 0.6s ease-in-out ${i * 0.1}s infinite`,
                  height: `${8 + Math.random() * 4}px`,
                }}
              />
            ))}
          </div>
          Playing
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play
        </>
      )}
    </button>
  );
}
