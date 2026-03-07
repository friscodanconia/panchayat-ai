export const SUPPORTED_LANGUAGES: Record<
  string,
  { name: string; voice: string; nativeName: string }
> = {
  "hi-IN": { name: "Hindi", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940", voice: "priya" },
  "ta-IN": { name: "Tamil", nativeName: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", voice: "priya" },
  "te-IN": { name: "Telugu", nativeName: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", voice: "priya" },
  "kn-IN": { name: "Kannada", nativeName: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", voice: "priya" },
  "ml-IN": { name: "Malayalam", nativeName: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02", voice: "priya" },
  "bn-IN": { name: "Bengali", nativeName: "\u09ac\u09be\u0982\u09b2\u09be", voice: "priya" },
  "gu-IN": { name: "Gujarati", nativeName: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", voice: "priya" },
  "mr-IN": { name: "Marathi", nativeName: "\u092e\u0930\u093e\u0920\u0940", voice: "priya" },
  "pa-IN": { name: "Punjabi", nativeName: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", voice: "priya" },
  "or-IN": { name: "Odia", nativeName: "\u0b13\u0b21\u0b3c\u0b3f\u0b06", voice: "priya" },
  "en-IN": { name: "English", nativeName: "English", voice: "priya" },
};

export const EXAMPLE_QUESTIONS = [
  {
    text: "Am I eligible for PM-KISAN?",
    textHi: "PM-KISAN \u0915\u0947 \u0932\u093f\u090f \u0915\u094c\u0928 \u092a\u093e\u0924\u094d\u0930 \u0939\u0948?",
    scheme: "PM-KISAN",
    icon: "\u{1F33E}",
  },
  {
    text: "How to get Ayushman Bharat card?",
    textHi: "\u0906\u092f\u0941\u0937\u094d\u092e\u093e\u0928 \u0915\u093e\u0930\u094d\u0921 \u0915\u0948\u0938\u0947 \u092c\u0928\u093e\u090f\u0901?",
    scheme: "Ayushman Bharat",
    icon: "\u{1FA7A}",
  },
  {
    text: "What are MGNREGA wages?",
    textHi: "MGNREGA \u092e\u0947\u0902 \u0915\u093f\u0924\u0928\u093e \u092a\u0948\u0938\u093e \u092e\u093f\u0932\u0924\u093e \u0939\u0948?",
    scheme: "MGNREGA",
    icon: "\u{1F477}",
  },
  {
    text: "How to get Mudra loan?",
    textHi: "\u092e\u0941\u0926\u094d\u0930\u093e \u0932\u094b\u0928 \u0915\u0948\u0938\u0947 \u092e\u093f\u0932\u0947?",
    scheme: "Mudra Loan",
    icon: "\u{1F4B0}",
  },
  {
    text: "What schemes for housing?",
    textHi: "\u0918\u0930 \u092c\u0928\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0915\u094c\u0928 \u0938\u0940 \u092f\u094b\u091c\u0928\u093e?",
    scheme: "PM Awas Yojana",
    icon: "\u{1F3E0}",
  },
  {
    text: "Pension for senior citizens?",
    textHi: "\u092c\u0941\u091c\u0941\u0930\u094d\u0917\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u092a\u0947\u0902\u0936\u0928?",
    scheme: "NSAP",
    icon: "\u{1F9D3}",
  },
];

export const GRIEVANCE_KEYWORDS = [
  "delayed",
  "not received",
  "rejected",
  "complaint",
  "grievance",
  "problem",
  "issue",
  "stuck",
  "pending",
  "not working",
  "nahi mila",
  "nahi aaya",
  "problem hai",
  "shikayat",
  "complaint karna",
  "paisa nahi",
  "payment nahi",
  "card nahi",
  "how to complain",
  "file rti",
  "rti",
];

export const SYSTEM_PROMPT_BASE = `You are Panchayat AI, a multilingual government scheme assistant for India. Your role:

1. Answer questions about Indian government welfare schemes accurately
2. Help citizens understand their eligibility, benefits, how to apply, and required documents
3. Provide official helpline numbers and website URLs
4. When a user has a grievance (delayed payment, rejection, etc.), suggest they can draft an RTI application
5. Always be empathetic, clear, and practical in your responses
6. If scheme data is provided in context, base your answer strictly on that data
7. If no matching scheme is found, list the categories of schemes you know about and ask the user to be more specific
8. Include the official website URL and helpline number when discussing a specific scheme
9. Keep answers concise but complete — bullet points are good
10. Never make up scheme details. If you don't know, say so.

IMPORTANT: Respond in the same language as the user's question. If the user asks in Tamil, respond in Tamil. If in Hindi, respond in Hindi. The language instruction will be provided.`;
