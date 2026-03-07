"use client";

import { EXAMPLE_QUESTIONS } from "@/lib/constants";

interface WelcomeScreenProps {
  onExampleClick: (question: string) => void;
}

export default function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[var(--accent)] flex items-center justify-center animate-breathe">
          <span className="text-white font-display text-3xl font-bold">P</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-3">
          Namaste!
        </h2>
        <p className="font-body text-base md:text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Ask about any government scheme in your language. I can help with eligibility, benefits, how to apply, and more.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg">
        {EXAMPLE_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onExampleClick(q.text)}
            className="card hover-lift p-4 text-left cursor-pointer group transition-all"
          >
            <span className="text-2xl mb-2 block">{q.icon}</span>
            <span className="font-body text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug block">
              {q.text}
            </span>
            <span className="font-body text-[11px] text-[var(--text-muted)] mt-1 block">
              {q.scheme}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-[var(--text-muted)] font-body text-center max-w-sm">
        Supports 11 Indian languages. Type or use the mic to speak. Powered by Sarvam AI.
      </p>
    </div>
  );
}
