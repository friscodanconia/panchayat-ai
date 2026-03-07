"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export default function Header({ selectedLanguage, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--surface)]/80 border-b border-[var(--border-subtle)]">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-display text-lg font-bold">P</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold leading-tight text-[var(--text-primary)]">
              Panchayat AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-body font-medium">
              Government Scheme Assistant
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 pr-8 text-sm font-body font-medium text-[var(--text-secondary)] cursor-pointer hover:border-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
