// src/services/twitter.ts
import { TwitterApi } from 'twitter-api-v2';

// Create a TwitterApi client instance
let twitterClient: TwitterApi | null = null;

export function getTwitterClient() {
  if (!twitterClient) {
    const consumerKey = process.env.TWITTER_CONSUMER_KEY;
    const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_TOKEN_SECRET;

    if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) {
      throw new Error("Twitter OAuth credentials are missing in environment variables");
    }

    // Create the client with OAuth 1.0a credentials
    twitterClient = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
  }

  return twitterClient;
}

export async function createTweet(text: string) {
  try {
    console.log(`Attempting to tweet: "${text}"`);

    const client = getTwitterClient();
    // Use the v2 endpoint to create a tweet
    const { data } = await client.v2.tweet(text);

    console.log('Tweet created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating tweet:', error);

    // Enhanced error handling for common Twitter API errors
    if (error.code) {
      // This is a TwitterApi error
      let errorMessage = `Twitter API Error: ${error.message}`;

      // Add specific handling for common error codes
      if (error.code === 403) {
        errorMessage = 'Twitter API rejected the request: Forbidden. This might be due to duplicate content or rate limits.';
      } else if (error.code === 401) {
        errorMessage = 'Twitter API authentication failed. Please check your credentials.';
      }

      const apiError = new Error(errorMessage);
      // Attach the original data for debugging
      (apiError).originalError = error;
      (apiError).code = error.code;
      (apiError).data = error.data;

      throw apiError;
    }

    // Re-throw the original error if it's not a TwitterApi error
    throw error;
  }
}
