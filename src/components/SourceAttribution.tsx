"use client";

import { useState } from "react";

interface Source {
  name: string;
  url: string;
  helpline: string;
}

interface SourceAttributionProps {
  sources: Source[];
}

export default function SourceAttribution({ sources }: SourceAttributionProps) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium bg-[var(--warm-50)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.182-5.244a4.5 4.5 0 00-6.364 6.364l4.5 4.5" />
        </svg>
        Sources ({sources.length})
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-72 card p-3 animate-scale-in z-10">
          {sources.map((s, i) => (
            <div key={i} className={`${i > 0 ? "mt-2 pt-2 border-t border-[var(--border-subtle)]" : ""}`}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm font-medium text-[var(--accent)] hover:underline block"
              >
                {s.name}
              </a>
              <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
                Helpline: {s.helpline}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
