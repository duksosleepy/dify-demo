// src/services/dify.ts
import { DifyClient, ChatClient, CompletionClient } from "dify-client";

// Singleton instances for the clients
let difyClient: DifyClient | null = null;
let chatClient: ChatClient | null = null;
let completionClient: CompletionClient | null = null;

// Get Dify client instance
export function getDifyClient() {
	if (!difyClient) {
		const apiKey = process.env.DIFY_API_KEY;

		if (!apiKey) {
			throw new Error("Dify API Key is missing in environment variables");
		}

		difyClient = new DifyClient(apiKey);
	}

	return difyClient;
}

// Get Chat client instance
export function getChatClient() {
	if (!chatClient) {
		const apiKey = process.env.DIFY_API_KEY;

		if (!apiKey) {
			throw new Error("Dify API Key is missing in environment variables");
		}

		chatClient = new ChatClient(apiKey);
	}

	return chatClient;
}

// Get Completion client instance
export function getCompletionClient() {
	if (!completionClient) {
		const apiKey = process.env.DIFY_API_KEY;

		if (!apiKey) {
			throw new Error("Dify API Key is missing in environment variables");
		}

		completionClient = new CompletionClient(apiKey);
	}

	return completionClient;
}

// Chat functions
export async function createChatMessage(
	query: string,
	userId: string,
	stream = false,
	files = null,
) {
	const client = getChatClient();

	try {
		return await client.createChatMessage(
			{},
			query,
			userId,
			stream,
			null,
			files,
		);
	} catch (error) {
		console.error("Error creating chat message:", error);
		throw error;
	}
}

export async function getConversations(userId: string) {
	const client = getChatClient();

	try {
		return await client.getConversations(userId);
	} catch (error) {
		console.error("Error fetching conversations:", error);
		throw error;
	}
}

export async function getConversationMessages(
	conversationId: string,
	userId: string,
) {
	const client = getChatClient();

	try {
		return await client.getConversationMessages(conversationId, userId);
	} catch (error) {
		console.error("Error fetching conversation messages:", error);
		throw error;
	}
}

export async function renameConversation(
	conversationId: string,
	name: string,
	userId: string,
) {
	const client = getChatClient();

	try {
		return await client.renameConversation(conversationId, name, userId);
	} catch (error) {
		console.error("Error renaming conversation:", error);
		throw error;
	}
}

// Completion functions
export async function createCompletionMessage(
	query: string,
	userId: string,
	stream = false,
	files = null,
) {
	const client = getCompletionClient();

	try {
		return await client.createCompletionMessage(
			{ query: query },
			userId,
			stream,
			files,
		);
	} catch (error) {
		console.error("Error creating completion message:", error);
		throw error;
	}
}

// Feedback function
export async function provideFeedback(
	messageId: string,
	rating: number,
	userId: string,
) {
	const client = getDifyClient();

	try {
		return await client.messageFeedback(messageId, rating, userId);
	} catch (error) {
		console.error("Error providing feedback:", error);
		throw error;
	}
}

// Application parameters
export async function getApplicationParameters(userId: string) {
	const client = getDifyClient();

	try {
		return await client.getApplicationParameters(userId);
	} catch (error) {
		console.error("Error fetching application parameters:", error);
		throw error;
	}
}
