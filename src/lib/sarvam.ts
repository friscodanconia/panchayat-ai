const SARVAM_BASE = "https://api.sarvam.ai";

export async function transcribeAudio(
  audioBlob: Blob,
  apiKey: string
): Promise<{ transcript: string; languageCode: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("language_code", "unknown");
  formData.append("model", "saaras:v3");
  formData.append("with_diarization", "false");
  formData.append("with_timestamps", "false");

  const res = await fetch(`${SARVAM_BASE}/speech-to-text`, {
    method: "POST",
    headers: { "api-subscription-key": apiKey },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`STT failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    transcript: data.transcript || "",
    languageCode: data.language_code || "unknown",
  };
}

export async function detectLanguage(
  text: string,
  apiKey: string
): Promise<{ languageCode: string; scriptCode: string }> {
  const res = await fetch(`${SARVAM_BASE}/text-lid`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: text }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Language ID failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return {
    languageCode: data.language_code || "unknown",
    scriptCode: data.script_code || "",
  };
}

export async function chatCompletion(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const res = await fetch(`${SARVAM_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sarvam-m",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chat failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const res = await fetch(`${SARVAM_BASE}/translate`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      model: "mayura:v1",
      mode: "modern-colloquial",
      enable_preprocessing: true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Translate failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.translated_text || "";
}

export async function synthesizeSpeech(
  text: string,
  targetLang: string,
  voice: string,
  apiKey: string
): Promise<string> {
  const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_language_code: targetLang,
      speaker: voice,
      model: "bulbul:v3",
      speech_sample_rate: 24000,
      output_audio_codec: "mp3",
      enable_preprocessing: true,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`TTS failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.audios?.[0] || "";
}
