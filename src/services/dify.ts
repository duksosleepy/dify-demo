// src/services/dify.ts

// Add this function to the existing file

// Direct workflow API call for grammar correction
export async function runGrammarCorrectionWorkflow(
	text: string,
	userId = "twitter-bot",
) {
	const apiKey = process.env.DIFY_API_KEY;

	if (!apiKey) {
		throw new Error("Dify API Key is missing in environment variables");
	}

	try {
		const response = await fetch("https://api.dify.ai/v1/workflows/run", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				inputs: { input_text: text },
				response_mode: "blocking",
				user: userId,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error || "Failed to run grammar correction workflow",
			);
		}

		const data = await response.json();

		// Check if the workflow succeeded
		if (data.data?.status !== "succeeded") {
			throw new Error(data.data?.error || "Workflow execution failed");
		}

		return {
			originalText: text,
			correctedText: data.data.outputs.output,
			taskId: data.task_id,
			workflowRunId: data.workflow_run_id,
			metrics: {
				elapsedTime: data.data.elapsed_time,
				totalTokens: data.data.total_tokens,
				totalSteps: data.data.total_steps,
			},
		};
	} catch (error) {
		console.error("Error running grammar correction workflow:", error);
		throw error;
	}
}

// Replace the previous correctGrammar function with this one
export async function correctGrammar(text: string, userId = "twitter-bot") {
	try {
		return await runGrammarCorrectionWorkflow(text, userId);
	} catch (error) {
		console.error("Error correcting grammar:", error);
		throw error;
	}
}
