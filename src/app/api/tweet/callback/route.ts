// src/app/api/twitter/callback/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { handleCallback } from "@/services/twitter";

export async function GET(request: NextRequest) {
	try {
		const code = request.nextUrl.searchParams.get("code");

		if (!code) {
			return NextResponse.json({ error: "No code provided" }, { status: 400 });
		}

		await handleCallback(code);

		// Redirect back to the main app
		return NextResponse.redirect(new URL("/", request.url));
	} catch (error) {
		console.error("Error handling Twitter callback:", error);
		return NextResponse.json(
			{ error: "Failed to authenticate with Twitter" },
			{ status: 500 },
		);
	}
}
