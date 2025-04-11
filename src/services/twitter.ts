//Import package
import { Client, auth } from "twitter-api-sdk";

// Initialize auth client first
const authClient = new auth.OAuth2User({
	client_id: process.env.CLIENT_ID as string,
	client_secret: process.env.CLIENT_SECRET as string,
	callback: "YOUR-CALLBACK",
	scopes: ["tweet.read", "users.read", "offline.access"],
});

// Pass auth credentials to the library client
const twitterClient = new Client(authClient);

const lookupTweetById = await twitterClient.tweets.findTweetById(
	// Tweet ID
	"1511757922354663425",
	{
		// Optional parameters
		expansions: ["author_id"],
		"user.fields": ["created_at", "description", "name"],
	},
);
