"use client";

import { useState } from "react";

interface RTIDraftModalProps {
  schemeId: string;
  issueContext: string;
  onClose: () => void;
}

export default function RTIDraftModal({ schemeId, issueContext, onClose }: RTIDraftModalProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState("");
  const [issueDescription, setIssueDescription] = useState(issueContext.slice(0, 200));

  const generateDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId,
          issueDescription,
          userName: userName || "[Your Name]",
          userAddress: "[Your Address]",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDraft(data.draft);
      }
    } catch (err) {
      console.error("RTI draft error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (draft) {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsTxt = () => {
    if (!draft) return;
    const blob = new Blob([draft], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RTI_Application_${schemeId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Draft RTI Application
            </h3>
            <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
              Right to Information Act, 2005
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--warm-100)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {!draft ? (
            <div className="space-y-4">
              <div>
                <label className="font-body text-sm font-medium text-[var(--text-secondary)] block mb-1">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-[var(--text-secondary)] block mb-1">
                  Describe your issue
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] resize-none"
                />
              </div>
              <button
                onClick={generateDraft}
                disabled={loading || !issueDescription}
                className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white font-body font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate RTI Draft"}
              </button>
            </div>
          ) : (
            <pre className="font-body text-xs leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap bg-[var(--warm-50)] rounded-xl p-4 border border-[var(--border-subtle)]">
              {draft}
            </pre>
          )}
        </div>

        {/* Footer with actions */}
        {draft && (
          <div className="p-4 border-t border-[var(--border-subtle)] flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 py-2 rounded-xl bg-[var(--accent)] text-white font-body font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={downloadAsTxt}
              className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-body font-medium text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              Download .txt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
