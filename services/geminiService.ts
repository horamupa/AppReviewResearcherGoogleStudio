import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppAnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Product Manager and Market Analyst with a specialization in Mobile Applications.
Your goal is to analyze specific App Store applications to understand user sentiment and identify market gaps.
When provided with an App Store link, you must:
1. Use Google Search to find user reviews, ratings, Reddit discussions, and tech articles about this specific app.
2. Identify the specific features users rave about.
3. Identify the specific pain points, bugs, or missing features users complain about.
4. Synthesize a "Killer App" concept that keeps the good parts but solves the bad parts.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    appName: {
      type: Type.STRING,
      description: "The name of the application being analyzed.",
    },
    likedFeatures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short catchy title of the feature" },
          description: { type: Type.STRING, description: "Detailed explanation of why users like it" },
        },
        required: ["title", "description"],
      },
      description: "Top 5 features users love.",
    },
    dislikedFeatures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short catchy title of the issue" },
          description: { type: Type.STRING, description: "Detailed explanation of the complaint" },
        },
        required: ["title", "description"],
      },
      description: "Top 5 features users dislike or complain about.",
    },
    competitorPrdMarkdown: {
      type: Type.STRING,
      description: "A complete PRD (Product Requirement Document) and Elevator Pitch in Markdown format. Include: 1. Elevator Pitch. 2. Core Value Proposition. 3. Key Differentiators (how it solves the dislikes). 4. MVP Feature List. 5. Go-to-Market Strategy.",
    },
  },
  required: ["appName", "likedFeatures", "dislikedFeatures", "competitorPrdMarkdown"],
};

export const analyzeAppUrl = async (url: string): Promise<AppAnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Please analyze this App Store URL: ${url}. 
      Read reviews and feedback found via search. 
      Summarize what users like and dislike, then write a PRD for a copycat app that improves on the original.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as AppAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the application. Please ensure the URL is valid and try again.");
  }
};
