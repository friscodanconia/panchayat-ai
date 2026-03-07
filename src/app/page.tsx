"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("hi-IN");

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
