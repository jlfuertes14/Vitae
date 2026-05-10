import Groq from "groq-sdk";
import { AI_MODELS } from "@/lib/constants";

// Groq client singleton
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ModelType = keyof typeof AI_MODELS;

/**
 * Generate a completion from Groq AI
 */
export async function generateCompletion(
  modelType: ModelType,
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  }
) {
  const model = AI_MODELS[modelType];

  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
    ...(options?.jsonMode && {
      response_format: { type: "json_object" },
    }),
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Stream a completion from Groq AI
 */
export async function streamCompletion(
  modelType: ModelType,
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) {
  const model = AI_MODELS[modelType];

  const stream = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
    stream: true,
  });

  return stream;
}

export { groq };
