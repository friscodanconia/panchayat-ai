"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import LanguageSelector from "@/components/LanguageSelector";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen">
        <LanguageSelector onSelect={setSelectedLanguage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <ChatInterface selectedLanguage={selectedLanguage} />
    </div>
  );
}
