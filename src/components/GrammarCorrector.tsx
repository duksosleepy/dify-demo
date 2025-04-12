// src/components/GrammarCorrector.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function GrammarCorrector() {
  const [originalText, setOriginalText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [success, setSuccess] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCorrectGrammar = async () => {
    if (!originalText.trim()) {
      setError("Please enter text to correct");
      return;
    }

    setIsLoading(true);
    setError("");
    setErrorDetails(null);
    setSuccess("");
    setMetrics(null);
    setShowPreview(false);

    try {
      const response = await fetch("/api/correct-grammar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: originalText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to correct grammar");
      }

      setCorrectedText(data.correctedText);
      setCharacterCount(data.correctedText.length);
      setMetrics(data.metrics);
    } catch (err: any) {
      setError(err.message || "Error correcting grammar. Please try again.");
      console.error("Grammar correction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTweet = async () => {
    if (!correctedText.trim()) {
      setError("Please correct the grammar first");
      return;
    }

    if (characterCount > 280) {
      setError("Your tweet exceeds the 280 character limit");
      return;
    }

    setIsLoading(true);
    setError("");
    setErrorDetails(null);
    setSuccess("");

    try {
      const response = await fetch("/api/tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: correctedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Enhanced error handling
        console.error("Tweet error:", data);

        const errorMessage = data.error || "Failed to tweet";

        // Set the error details for display
        setErrorDetails(data.details);

        throw new Error(errorMessage);
      }

      setSuccess("Tweet posted successfully!");
      setShowPreview(false);
    } catch (err: any) {
      setError(err.message || "Error posting tweet. Please try again.");
      console.error("Tweet error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCorrectedText(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Grammar Correction & Tweet</h1>

      {error && (
        <div className="mb-4">
          <div className="p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
          {errorDetails && (
            <details className="mt-2 p-2 border border-red-200 rounded-md">
              <summary className="cursor-pointer text-sm text-red-600">
                Show API Error Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-50 text-xs overflow-auto max-h-40">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="originalText" className="block mb-2 font-medium">
          Enter text to correct:
        </label>
        <textarea
          id="originalText"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          rows={5}
          placeholder="Enter your text here..."
        />
      </div>

      <button
        onClick={handleCorrectGrammar}
        disabled={isLoading || !originalText.trim()}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isLoading && !correctedText ? "Processing..." : "Correct Grammar"}
      </button>

      {correctedText && (
        <>
          <div className="mb-4">
            <label htmlFor="correctedText" className="block mb-2 font-medium">
              Corrected text:
            </label>
            <textarea
              id="correctedText"
              value={correctedText}
              onChange={handleTextChange}
              className={`w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                characterCount > 280 ? 'border-red-500' : ''
              }`}
              rows={5}
            />
            <div className={`flex justify-between mt-1 text-sm`}>
              <span className="text-gray-500">
                {metrics && `Processing time: ${metrics.elapsedTime?.toFixed(2) || 'N/A'}s | Tokens: ${metrics.totalTokens || 'N/A'}`}
              </span>
              <span className={`${characterCount > 280 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {characterCount}/280 characters
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleTweet}
              disabled={isLoading || !correctedText.trim() || characterCount > 280}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Posting..." : "Tweet This"}
            </button>

            <button
              onClick={togglePreview}
              disabled={!correctedText.trim()}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {showPreview && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b">
                <h3 className="font-medium">Tweet Preview</h3>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">User</span>
                      <span className="text-gray-500">@user</span>
                    </div>
                    <p className="mt-1">{correctedText}</p>
                    <div className="mt-3 flex items-center gap-6 text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        0
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 1l4 4-4 4"></path>
                          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                          <path d="M7 23l-4-4 4-4"></path>
                          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                        </svg>
                        0
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
