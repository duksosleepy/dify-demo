// src/app/api/tweet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createTweet } from "@/services/twitter";

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text) {
			return NextResponse.json({ error: "Text is required" }, { status: 400 });
		}

		// Check if text exceeds Twitter's character limit
		if (text.length > 280) {
			return NextResponse.json(
				{ error: "Text exceeds Twitter's 280 character limit" },
				{ status: 400 },
			);
		}

		const result = await createTweet(text);

		return NextResponse.json({
			success: true,
			tweet: result,
		});
	} catch (error) {
		console.error("Error in tweet API route:", error);

		// Prepare detailed error response
		const errorResponse = {
			error: error.message || "Failed to post tweet",
			timestamp: new Date().toISOString(),
			details: {},
		};

		// Add additional details if available
		if (error.originalError) {
			errorResponse.details = {
				code: error.code,
				data: error.data,
				originalError: {
					message: error.originalError.message,
					stack: error.originalError.stack,
				},
			};
		}

		return NextResponse.json(errorResponse, { status: error.code || 500 });
	}
}
