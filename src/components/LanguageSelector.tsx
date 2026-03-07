"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  onSelect: (code: string) => void;
}

export default function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const languages = Object.entries(SUPPORTED_LANGUAGES);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[var(--accent)] flex items-center justify-center animate-breathe">
          <span className="text-white font-display text-3xl font-bold">P</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-2">
          Panchayat AI
        </h1>
        <p className="font-body text-sm uppercase tracking-[0.15em] text-[var(--text-muted)] font-medium mb-6">
          Government Scheme Assistant
        </p>
        <p className="font-body text-base md:text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Choose your language to get started
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-lg">
        {languages.map(([code, lang]) => (
          <button
            key={code}
            onClick={() => onSelect(code)}
            className="card hover-lift p-4 text-center cursor-pointer group transition-all"
          >
            <span className="font-display text-xl md:text-2xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors block leading-tight">
              {lang.nativeName}
            </span>
            <span className="font-body text-xs text-[var(--text-muted)] mt-1.5 block">
              {lang.name}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-xs text-[var(--text-muted)] font-body text-center max-w-sm">
        Ask about PM-KISAN, Ayushman Bharat, MGNREGA, and 17 more schemes. Text or voice.
      </p>
    </div>
  );
}
