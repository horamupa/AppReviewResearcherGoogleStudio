import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppAnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Product Manager and Market Analyst with a specialization in Mobile Applications.
Your goal is to analyze specific App Store applications to understand user sentiment and identify market gaps.

When provided with an App Store link, you must:
1. Use Google Search to find user reviews, ratings, Reddit discussions, and tech articles about this specific app.
2. AIM TO ANALYZE AT LEAST 150 REVIEWS (or as many as available) from various sources (App Store web view, aggregators, forums) to form a statistically significant opinion.
3. EXTRACT a representative list of "Source Reviews" that heavily influenced your decision. Try to return at least 20-30 diverse reviews (positive, negative, mixed) in the response.
4. Identify the specific features users rave about.
5. Identify the specific pain points, bugs, or missing features users complain about.
6. Formulate a set of "PRD Generation Rules". This is the logic/methodology you used. For example: "Since 40% of users complained about X, Rule #1 is to fix X."
7. Synthesize a "Killer App" concept (PRD) based on these rules.
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
    reviews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          author: { type: Type.STRING, description: "Name of reviewer or 'Anonymous'" },
          rating: { type: Type.NUMBER, description: "Star rating (1-5)" },
          title: { type: Type.STRING, description: "Title of the review if available" },
          content: { type: Type.STRING, description: "The content of the review" },
        },
        required: ["author", "rating", "content"],
      },
      description: "A list of 20+ representative reviews extracted from the 150+ analyzed. These serve as the evidence for your analysis.",
    },
    competitorPrdMarkdown: {
      type: Type.STRING,
      description: "A complete PRD (Product Requirement Document) and Elevator Pitch in Markdown format. Include: 1. Elevator Pitch. 2. Core Value Proposition. 3. Key Differentiators. 4. MVP Feature List. 5. Go-to-Market Strategy.",
    },
    prdRulesMarkdown: {
      type: Type.STRING,
      description: "A separate Markdown file describing the 'Rules' or 'Methodology' used to create the PRD. Explain the data-driven decisions. E.g., 'Rule 1: Prioritize Dark Mode because 60 reviews mentioned eye strain.'",
    },
  },
  required: ["appName", "likedFeatures", "dislikedFeatures", "reviews", "competitorPrdMarkdown", "prdRulesMarkdown"],
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
      Read and analyze at least 150 reviews if possible.
      Summarize likes/dislikes, return the raw reviews you found significant, define your PRD rules, and write the PRD.`,
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
