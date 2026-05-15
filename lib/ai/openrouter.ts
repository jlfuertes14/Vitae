type OpenRouterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

import { OPEN_ROUTER_FREE_MODEL_PREFIXES } from "@/lib/constants";

const normalizeList = (value?: string | null) =>
  (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const getAllowedModels = () => {
  const exact = normalizeList(process.env.OPEN_ROUTER_ALLOWED_MODELS);
  const prefixes = normalizeList(process.env.OPEN_ROUTER_ALLOWED_PREFIXES);
  return {
    exact,
    prefixes: prefixes.length > 0 ? prefixes : OPEN_ROUTER_FREE_MODEL_PREFIXES,
  };
};

const isAllowedModel = (
  modelId: string,
  allowedExact: string[],
  allowedPrefixes: string[]
) => {
  if (!modelId.endsWith(":free")) return false;
  if (allowedExact.length > 0) {
    return allowedExact.includes(modelId);
  }
  return allowedPrefixes.some((prefix) => modelId.startsWith(prefix));
};

const getConfiguredModels = (modelType: string) => {
  const typeKey = modelType.toUpperCase();
  const typedList = normalizeList(
    process.env[`OPEN_ROUTER_MODELS_${typeKey}` as keyof NodeJS.ProcessEnv]
  );
  if (typedList.length > 0) return typedList;

  const typedSingle = normalizeList(
    process.env[`OPEN_ROUTER_MODEL_${typeKey}` as keyof NodeJS.ProcessEnv]
  );
  if (typedSingle.length > 0) return typedSingle;

  const generalList = normalizeList(process.env.OPEN_ROUTER_MODELS);
  if (generalList.length > 0) return generalList;

  const generalSingle = normalizeList(process.env.OPEN_ROUTER_MODEL);
  return generalSingle;
};

export const selectOpenRouterModels = (modelType: string) => {
  const configured = getConfiguredModels(modelType);
  const { exact, prefixes } = getAllowedModels();

  if (configured.length > 0) {
    const allowed = configured.filter((model) =>
      isAllowedModel(model, exact, prefixes)
    );
    if (allowed.length === 0) {
      throw new Error(`OpenRouter models not allowed: ${configured.join(", ")}`);
    }
    return allowed;
  }

  if (exact.length > 0) {
    const allowed = exact.filter((model) =>
      isAllowedModel(model, exact, prefixes)
    );
    if (allowed.length > 0) {
      return allowed;
    }
  }

  throw new Error("No OpenRouter model configured");
};

export const openRouterChatCompletion = async (params: {
  models: string[];
  messages: OpenRouterMessage[];
  temperature: number;
  maxTokens: number;
  jsonMode?: boolean;
}) => {
  const apiKey = process.env.OPEN_ROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OpenRouter API key is missing");
  }

  const retryableStatus = new Set([429, 500, 502, 503, 504]);
  let lastError: Error | null = null;

  for (const model of params.models) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        ...(params.jsonMode && { response_format: { type: "json_object" } }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(`OpenRouter error (${response.status}) on ${model}: ${errorText}`);
      if (retryableStatus.has(response.status)) {
        lastError = err;
        continue;
      }
      throw err;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : "";
  }

  throw lastError || new Error("OpenRouter error: all models failed");
};
