import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, translateText, detectLanguage } from "@/lib/sarvam";
import { matchSchemes, buildSchemeContext, hasGrievanceSignal } from "@/lib/schemes";
import { SYSTEM_PROMPT_BASE, SUPPORTED_LANGUAGES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SARVAM_API_KEY not set" }, { status: 500 });
  }

  try {
    const { message, languageCode: providedLangCode, history = [] } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    // 1. Detect language if not provided
    let languageCode = providedLangCode;
    if (!languageCode || languageCode === "unknown") {
      const detected = await detectLanguage(message, apiKey);
      languageCode = detected.languageCode;
    }

    // Normalize language code
    if (languageCode && !languageCode.includes("-")) {
      languageCode = `${languageCode}-IN`;
    }

    const langInfo = SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES["en-IN"];
    const isEnglish = languageCode === "en-IN";

    // 2. Translate to English for scheme matching (if not already English)
    let queryForMatching = message;
    if (!isEnglish) {
      try {
        queryForMatching = await translateText(message, languageCode, "en-IN", apiKey);
      } catch {
        // If translation fails, try matching with original text
        queryForMatching = message;
      }
    }

    // 3. Match schemes
    const matchedSchemes = matchSchemes(queryForMatching);
    const schemeContext = buildSchemeContext(matchedSchemes);

    // 4. Check for grievance signals
    const isGrievance = hasGrievanceSignal(queryForMatching);

    // 5. Build system prompt with scheme context
    const languageInstruction = isEnglish
      ? "Respond in English."
      : `Respond in ${langInfo.name} (${langInfo.nativeName}). The user is communicating in ${langInfo.name}.`;

    const systemPrompt = `${SYSTEM_PROMPT_BASE}

${languageInstruction}

${isGrievance ? "The user seems to have a grievance or complaint. After answering, mention that they can draft an RTI (Right to Information) application for their issue. Be empathetic." : ""}

SCHEME DATA:
${schemeContext}`;

    // 6. Build message history for context
    const chatMessages = [
      ...history.slice(-6).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    // 7. Call Sarvam-30B
    const answer = await chatCompletion(systemPrompt, chatMessages, apiKey);

    return NextResponse.json({
      answer,
      languageCode,
      languageName: langInfo.name,
      schemeIds: matchedSchemes.map((s) => s.id),
      schemeNames: matchedSchemes.map((s) => s.name),
      isGrievance,
      sources: matchedSchemes.map((s) => ({
        name: s.name,
        url: s.officialUrl,
        helpline: Object.entries(s.helpline)
          .filter(([, v]) => typeof v === "string")
          .map(([k, v]) => `${k}: ${v}`)
          .join(" / "),
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Chat failed";
    console.error("Chat error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
