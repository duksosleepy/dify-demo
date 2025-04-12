// src/app/api/twitter/auth/route.ts
import { NextResponse } from "next/server";
import { getAuthUrl } from "@/services/twitter";

export function GET() {
	try {
		const authUrl = getAuthUrl();

		return NextResponse.json({ authUrl });
	} catch (error) {
		console.error("Error generating Twitter auth URL:", error);
		return NextResponse.json(
			{ error: "Failed to generate Twitter authentication URL" },
			{ status: 500 },
		);
	}
}
