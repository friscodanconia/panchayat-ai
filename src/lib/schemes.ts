import schemesData from "../../data/schemes.json";

export interface Scheme {
  id: string;
  name: string;
  fullName: string;
  category: string;
  ministry: string;
  status: string;
  whatItIs: string;
  benefits: string[];
  eligibility: {
    whoCanApply: string[];
    whoCannotApply?: string[];
  };
  documentsRequired: string[];
  howToApply: string[];
  helpline: Record<string, unknown>;
  officialUrl: string;
  checkStatus?: string;
  grievance: string;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const schemes: Scheme[] = (schemesData as any).schemes as Scheme[];

// Alias map — common names/abbreviations that map to scheme IDs
const SCHEME_ALIASES: Record<string, string> = {
  "pm kisan": "pm-kisan",
  "pm-kisan": "pm-kisan",
  "pmkisan": "pm-kisan",
  "kisan samman": "pm-kisan",
  "kisan nidhi": "pm-kisan",
  "ayushman": "pmjay",
  "ayushman bharat": "pmjay",
  "pmjay": "pmjay",
  "pm-jay": "pmjay",
  "jan arogya": "pmjay",
  "mgnrega": "mgnrega",
  "nrega": "mgnrega",
  "mnrega": "mgnrega",
  "100 days": "mgnrega",
  "100 din": "mgnrega",
  "mudra": "mudra",
  "mudra loan": "mudra",
  "pmmy": "mudra",
  "pm awas": "pmay",
  "pmay": "pmay",
  "awas yojana": "pmay",
  "housing scheme": "pmay",
  "ghar yojana": "pmay",
  "ujjwala": "ujjwala",
  "lpg": "ujjwala",
  "gas cylinder": "ujjwala",
  "fasal bima": "pmfby",
  "pmfby": "pmfby",
  "crop insurance": "pmfby",
  "bima yojana": "pmfby",
  "sukanya": "ssy",
  "sukanya samriddhi": "ssy",
  "ssy": "ssy",
  "girl child": "ssy",
  "jan dhan": "pmjdy",
  "pmjdy": "pmjdy",
  "bank account": "pmjdy",
  "zero balance": "pmjdy",
  "atal pension": "apy",
  "apy": "apy",
  "pension scheme": "apy",
  "old age pension": "nsap",
  "nsap": "nsap",
  "widow pension": "nsap",
  "disability pension": "nsap",
  "senior citizen pension": "nsap",
  "scholarship": "scholarship",
  "education": "scholarship",
  "shram yogi": "pmsym",
  "pmsym": "pmsym",
  "saubhagya": "saubhagya",
  "electricity": "saubhagya",
  "bijli": "saubhagya",
  "toilet": "sbm",
  "swachh bharat": "sbm",
  "sbm": "sbm",
  "skill india": "skill-india",
  "pmkvy": "skill-india",
  "kaushal": "skill-india",
  "stand up india": "stand-up-india",
  "sc st loan": "stand-up-india",
  "startup india": "startup-india",
  "startup": "startup-india",
  "maternity": "pmmvy",
  "pmmvy": "pmmvy",
  "pregnant": "pmmvy",
  "jeevan jyoti": "pmjjby",
  "pmjjby": "pmjjby",
  "suraksha bima": "pmsby",
  "pmsby": "pmsby",
  "accident insurance": "pmsby",
  "ration": "nfsa",
  "nfsa": "nfsa",
  "free food": "nfsa",
  "food security": "nfsa",
  "ration card": "nfsa",
};

// Category keyword map
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Agriculture: ["farmer", "kisan", "kheti", "crop", "fasal", "farming", "agriculture"],
  Health: ["hospital", "doctor", "health", "medical", "treatment", "dawai", "ilaj", "bimar", "swasthya"],
  Employment: ["job", "kaam", "rozgar", "work", "employment", "naukri", "mazdoor", "labour", "wages"],
  Housing: ["house", "ghar", "awas", "home", "housing", "makaan"],
  "Financial Inclusion": ["bank", "account", "loan", "paise", "paisa", "money", "insurance", "bima", "pension"],
  Education: ["school", "college", "padhai", "study", "scholarship", "education", "shiksha"],
  "Women & Child": ["woman", "mahila", "girl", "ladki", "pregnant", "maternity", "child", "bachcha"],
  Sanitation: ["toilet", "sanitation", "safai", "swachh", "cleanliness"],
  Energy: ["gas", "cylinder", "bijli", "electricity", "lpg", "energy"],
  "Skill Development": ["skill", "training", "kaushal", "course", "certificate"],
};

export function matchSchemes(query: string): Scheme[] {
  const q = query.toLowerCase().trim();
  const matched: Set<string> = new Set();

  // 1. Exact alias match
  for (const [alias, schemeId] of Object.entries(SCHEME_ALIASES)) {
    if (q.includes(alias)) {
      matched.add(schemeId);
    }
  }

  // 2. Direct scheme name match
  for (const scheme of schemes) {
    const nameLower = scheme.name.toLowerCase();
    const fullNameLower = scheme.fullName.toLowerCase();
    if (q.includes(nameLower) || q.includes(fullNameLower)) {
      matched.add(scheme.id);
    }
  }

  // 3. If we have matches, return them
  if (matched.size > 0) {
    return schemes.filter((s) => matched.has(s.id)).slice(0, 3);
  }

  // 4. Category keyword match
  const categoryMatches: Set<string> = new Set();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        categoryMatches.add(category);
      }
    }
  }

  if (categoryMatches.size > 0) {
    const categorySchemes = schemes.filter((s) =>
      categoryMatches.has(s.category)
    );
    return categorySchemes.slice(0, 3);
  }

  // 5. No match — return empty (caller will inject summary)
  return [];
}

export function buildSchemeContext(matchedSchemes: Scheme[]): string {
  if (matchedSchemes.length === 0) {
    return buildSchemeSummary();
  }

  return matchedSchemes
    .map(
      (s) => `
--- SCHEME: ${s.name} (${s.fullName}) ---
Category: ${s.category}
Ministry: ${s.ministry}
Status: ${s.status}

What it is: ${s.whatItIs}

Benefits:
${s.benefits.map((b) => `- ${b}`).join("\n")}

Who can apply:
${s.eligibility.whoCanApply.map((e) => `- ${e}`).join("\n")}

${s.eligibility.whoCannotApply ? `Who cannot apply:\n${s.eligibility.whoCannotApply.map((e) => `- ${e}`).join("\n")}` : ""}

Documents required:
${s.documentsRequired.map((d) => `- ${d}`).join("\n")}

How to apply:
${s.howToApply.map((h) => `- ${h}`).join("\n")}

Helpline: ${flattenHelpline(s.helpline)}
Official website: ${s.officialUrl}
${s.checkStatus ? `Check status: ${s.checkStatus}` : ""}
Grievance: ${s.grievance}
---`
    )
    .join("\n\n");
}

function buildSchemeSummary(): string {
  const byCategory: Record<string, string[]> = {};
  for (const s of schemes) {
    if (!byCategory[s.category]) byCategory[s.category] = [];
    byCategory[s.category].push(`${s.name} (${s.fullName})`);
  }

  let summary = "Available government schemes by category:\n\n";
  for (const [cat, names] of Object.entries(byCategory)) {
    summary += `${cat}:\n${names.map((n) => `  - ${n}`).join("\n")}\n\n`;
  }
  summary +=
    "Ask about any specific scheme for detailed eligibility, benefits, and how to apply.";
  return summary;
}

function flattenHelpline(helpline: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(helpline)) {
    if (typeof val === "string") {
      parts.push(`${key}: ${val}`);
    }
  }
  return parts.join(" | ");
}

export function getSchemeById(id: string): Scheme | undefined {
  return schemes.find((s) => s.id === id);
}

export function getAllSchemes(): Scheme[] {
  return schemes;
}

export function hasGrievanceSignal(text: string): boolean {
  const lower = text.toLowerCase();
  const keywords = [
    "delayed", "not received", "rejected", "complaint", "grievance",
    "problem", "issue", "stuck", "pending", "not working",
    "nahi mila", "nahi aaya", "problem hai", "shikayat",
    "paisa nahi", "payment nahi", "card nahi",
    "how to complain", "file rti", "rti",
  ];
  return keywords.some((kw) => lower.includes(kw));
}
