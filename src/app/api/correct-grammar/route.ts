// src/app/api/correct-grammar/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { correctGrammar } from "@/services/dify";

export async function POST(request: NextRequest) {
	try {
		const { text, userId = "twitter-bot" } = await request.json();

		if (!text) {
			return NextResponse.json({ error: "Text is required" }, { status: 400 });
		}

		const result = await correctGrammar(text, userId);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error in correct-grammar API:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to correct grammar" },
			{ status: 500 },
		);
	}
}
