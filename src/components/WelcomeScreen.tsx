"use client";

import { EXAMPLE_QUESTIONS, SUPPORTED_LANGUAGES } from "@/lib/constants";

interface WelcomeScreenProps {
  onExampleClick: (question: string) => void;
  languageCode: string;
}

const WELCOME_TEXT: Record<string, { greeting: string; subtitle: string }> = {
  "hi-IN": { greeting: "Namaste!", subtitle: "Kisi bhi sarkari yojana ke baare mein poochhein" },
  "ta-IN": { greeting: "Vanakkam!", subtitle: "Arasu thittangal patri kelungal" },
  "te-IN": { greeting: "Namaskaram!", subtitle: "Prabhutvam padhakalanu gurinchi adagandi" },
  "kn-IN": { greeting: "Namaskara!", subtitle: "Sarkari yojane bagge keli" },
  "ml-IN": { greeting: "Namaskkaram!", subtitle: "Sarkar padhathikal kurichu chodikkuka" },
  "bn-IN": { greeting: "Nomoshkar!", subtitle: "Sorkari prakalpo somporke jiggesh korun" },
  "gu-IN": { greeting: "Namaste!", subtitle: "Sarkari yojana vishe puchho" },
  "mr-IN": { greeting: "Namaskar!", subtitle: "Sarkari yojana baddal vicharaa" },
  "pa-IN": { greeting: "Sat Sri Akaal!", subtitle: "Sarkari yojnavan baare puchho" },
  "or-IN": { greeting: "Namaskar!", subtitle: "Sarkari yojana bisayare puchhantu" },
  "en-IN": { greeting: "Hello!", subtitle: "Ask about any government scheme" },
};

export default function WelcomeScreen({ onExampleClick, languageCode }: WelcomeScreenProps) {
  const langInfo = SUPPORTED_LANGUAGES[languageCode];
  const welcome = WELCOME_TEXT[languageCode] || WELCOME_TEXT["en-IN"];
  const isEnglish = languageCode === "en-IN";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-bg)] border border-[var(--border-accent)] text-[var(--accent)] font-body text-xs font-medium mb-4">
          {langInfo?.nativeName || "English"}
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-3">
          {welcome.greeting}
        </h2>
        <p className="font-body text-base md:text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          {welcome.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg">
        {EXAMPLE_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onExampleClick(isEnglish ? q.text : q.textHi)}
            className="card hover-lift p-4 text-left cursor-pointer group transition-all"
          >
            <span className="text-2xl mb-2 block">{q.icon}</span>
            <span className="font-body text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug block">
              {isEnglish ? q.text : q.textHi}
            </span>
            <span className="font-body text-[11px] text-[var(--text-muted)] mt-1 block">
              {q.scheme}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-[var(--text-muted)] font-body text-center max-w-sm">
        Powered by Sarvam AI
      </p>
    </div>
  );
}
