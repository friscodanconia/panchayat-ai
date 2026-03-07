import { NextRequest, NextResponse } from "next/server";
import { getSchemeById } from "@/lib/schemes";
import { generateRTIDraft } from "@/lib/rti";

export async function POST(req: NextRequest) {
  try {
    const { schemeId, issueDescription, userName, userAddress } = await req.json();
    if (!schemeId || !issueDescription) {
      return NextResponse.json(
        { error: "Missing schemeId or issueDescription" },
        { status: 400 }
      );
    }

    const scheme = getSchemeById(schemeId);
    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    const draft = generateRTIDraft(scheme, issueDescription, userName, userAddress);
    return NextResponse.json({ draft, schemeName: scheme.name });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "RTI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
