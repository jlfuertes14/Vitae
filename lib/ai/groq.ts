import Groq from "groq-sdk";
import { AI_MODELS } from "@/lib/constants";
import { openRouterChatCompletion, selectOpenRouterModels } from "@/lib/ai/openrouter";

// Groq client singleton
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ModelType = keyof typeof AI_MODELS;

const getSecondaryTasks = () =>
  new Set(
    (process.env.AI_SECONDARY_TASKS || "generation,scoring")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  );

const shouldUseSecondary = (modelType: ModelType) => {
  const secondaryProvider = (process.env.AI_PROVIDER_SECONDARY || "").toLowerCase();
  if (secondaryProvider !== "openrouter") return false;
  return getSecondaryTasks().has(modelType);
};

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
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 4096;

  if (shouldUseSecondary(modelType)) {
    try {
      const models = selectOpenRouterModels(modelType);
      return await openRouterChatCompletion({
        models,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        maxTokens,
        jsonMode: options?.jsonMode,
      });
    } catch (error) {
      const allowFallback =
        (process.env.AI_SECONDARY_FALLBACK || "true").toLowerCase() === "true";
      if (!allowFallback) {
        throw error;
      }
    }
  }

  const model = AI_MODELS[modelType];

  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
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
