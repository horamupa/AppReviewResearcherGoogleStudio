import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppAnalysisResult } from "../types";

// Instructions derived from UXSkill.md
const UX_SKILL_INSTRUCTION = `
# iOS Product Designer

Transform competitor analysis into actionable product specifications.

## Analysis Process

### Step 1: Extract Insights from Reviews
Categorize review content into three buckets:
- **Feature gaps**: "I wish it had...", "Missing...", "Would be great if..."
- **Pain points**: "Frustrating...", "Annoying...", "Crashes when...", "Too slow..."
- **Praised features**: "Love the...", "Best part is...", "Finally an app that..."

### Step 2: Map Competitor Features
From the app description, extract: Core functionality, Target user segment, Key value proposition, Feature set.

### Step 3: Define Superior Product
For each insight category, determine product response:
- **Feature gaps** → New features to include
- **Pain points** → Problems to solve differently
- **Praised features** → Match or exceed

## Output: PRD Document

Generate markdown PRD with these sections in order:

# [App Name] — Product Requirements Document

## 1. Overview
Brief description of the app concept and how it improves on the competitor.

## 2. Value Proposition
Single clear statement of why users choose this over alternatives.

## 3. Target Users
### Primary Persona
- Name, age range, occupation
- Goals and motivations
- Current frustrations (from review analysis)

### Secondary Persona (if applicable)

## 4. Core Features
List features organized by priority:
### Must Have (MVP)
### Should Have (v1.1)
### Nice to Have (Future)

## 5. Information Architecture
### App Structure (Tree format)
### Data Model (conceptual)

## 6. User Journeys
### Journey 1: [Primary Task]
1. User opens app → sees [what]
2. User taps [element] → [result]
3. Continue flow...
4. End state: [outcome]

### Journey 2: [Secondary Task]

## 7. Screen-by-Screen Specifications

### Screen: [Name]
**Purpose:** Why this screen exists
**Entry points:** How users arrive here
**Layout:**
- Top/Middle/Bottom section details
**Elements:**
- Element 1: Type, purpose, behavior
**Actions available:**
- Action 1 → leads to [screen/result]
**Exit points:** Where users go next

(Repeat for each screen)

## 8. UX Principles
Guiding principles for this product.

## UX Design Philosophy
- **Minimalism** — Every element must earn its place; remove until it breaks
- **Bauhaus influence** — Form follows function; clear visual hierarchy; geometric clarity
- **60-30-10 color rule** — 60% dominant neutral, 30% secondary, 10% accent for actions
- **Purposeful animation** — Motion only for feedback, transitions, or directing attention; never decorative

## Quality Checklist
- [ ] Every feature gap from reviews is addressed
- [ ] Every pain point has a solution
- [ ] Praised competitor features are matched or improved
- [ ] Each screen has clear purpose and exit points
- [ ] User journeys cover primary tasks end-to-end
- [ ] Information architecture is max 3 levels deep
`;

const SYSTEM_INSTRUCTION = `
You are an expert Product Manager and Market Analyst with a specialization in Mobile Applications.
Your goal is to analyze specific App Store applications to understand user sentiment and identify market gaps.

${UX_SKILL_INSTRUCTION}

When provided with an App Store link, you must:
1. Use Google Search to find user reviews, ratings, Reddit discussions, and tech articles about this specific app.
2. AIM TO ANALYZE AT LEAST 150 REVIEWS (or as many as available) from various sources (App Store web view, aggregators, forums) to form a statistically significant opinion.
3. EXTRACT a representative list of "Source Reviews" that heavily influenced your decision. Try to return at least 20-30 diverse reviews (positive, negative, mixed) in the response.
4. Identify the specific features users rave about.
5. Identify the specific pain points, bugs, or missing features users complain about.
6. Formulate a set of "PRD Generation Rules". This is the logic/methodology you used. For example: "Since 40% of users complained about X, Rule #1 is to fix X."
7. Synthesize a "Killer App" concept (PRD) STRICTLY FOLLOWING the structure defined in "Output: PRD Document" above.
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
      description: "A complete PRD (Product Requirement Document) in Markdown format. MUST follow the 'Output: PRD Document' structure from the system instructions exactly.",
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
      Summarize likes/dislikes, return the raw reviews you found significant, define your PRD rules.
      
      Finally, write the PRD by STRICTLY following the "iOS Product Designer" and "Output: PRD Document" sections in your system instructions.`,
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
