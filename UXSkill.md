---
name: ios-product-designer
description: iOS app product design skill that analyzes competitor app descriptions and user reviews to generate comprehensive PRD (Product Requirements Document) in markdown. Use when given a competitor app's product description and reviews to create a superior app concept with detailed UX flows. Triggers on requests like "design an app better than [competitor]", "create PRD from these reviews", "analyze this app and design something better", or when provided with app store descriptions and user reviews for competitive analysis.
---

# iOS Product Designer

Transform competitor analysis into actionable product specifications.

## Input Requirements

Expect two inputs from user:
1. **Competitor app description** — App store description or product overview
2. **Competitor app reviews** — User reviews (positive and negative)

## Analysis Process

### Step 1: Extract Insights from Reviews

See [references/review-patterns.md](references/review-patterns.md) for detailed extraction patterns and examples.

Categorize review content into three buckets:

| Category | What to look for |
|----------|------------------|
| **Feature gaps** | "I wish it had...", "Missing...", "Would be great if...", "No way to..." |
| **Pain points** | "Frustrating...", "Annoying...", "Crashes when...", "Too slow...", "Confusing..." |
| **Praised features** | "Love the...", "Best part is...", "Finally an app that...", "So easy to..." |

### Step 2: Map Competitor Features

From the app description, extract:
- Core functionality
- Target user segment
- Key value proposition
- Feature set

### Step 3: Define Superior Product

For each insight category, determine product response:

- **Feature gaps** → New features to include
- **Pain points** → Problems to solve differently
- **Praised features** → Match or exceed

## Output: PRD Document

Generate markdown PRD with these sections in order:

```markdown
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
- Same structure

## 4. Core Features

List features organized by priority:

### Must Have (MVP)
- Feature 1: Brief description
- Feature 2: Brief description

### Should Have (v1.1)
- Feature 3: Brief description

### Nice to Have (Future)
- Feature 4: Brief description

## 5. Information Architecture

### App Structure
```
Tab Bar / Navigation Structure
├── Section 1
│   ├── Screen 1.1
│   └── Screen 1.2
├── Section 2
│   └── Screen 2.1
└── Section 3
```

### Data Model (conceptual)
Key entities and their relationships.

## 6. User Journeys

### Journey 1: [Primary Task]
1. User opens app → sees [what]
2. User taps [element] → [result]
3. Continue flow...
4. End state: [outcome]

### Journey 2: [Secondary Task]
Same structure.

## 7. Screen-by-Screen Specifications

### Screen: [Name]
**Purpose:** Why this screen exists

**Entry points:** How users arrive here

**Layout:**
- Top section: [content]
- Middle section: [content]
- Bottom section: [content]

**Elements:**
- Element 1: Type, purpose, behavior
- Element 2: Type, purpose, behavior

**Actions available:**
- Action 1 → leads to [screen/result]
- Action 2 → leads to [screen/result]

**Exit points:** Where users go next

(Repeat for each screen)

## 8. UX Principles

Guiding principles for this product:
- Principle 1: Explanation
- Principle 2: Explanation
- Principle 3: Explanation
```

## UX Design Philosophy

Apply these principles throughout:

- **Minimalism** — Every element must earn its place; remove until it breaks
- **Bauhaus influence** — Form follows function; clear visual hierarchy; geometric clarity
- **60-30-10 color rule** — 60% dominant neutral, 30% secondary, 10% accent for actions
- **Purposeful animation** — Motion only for feedback, transitions, or directing attention; never decorative

## Quality Checklist

Before finalizing PRD, verify:

- [ ] Every feature gap from reviews is addressed
- [ ] Every pain point has a solution
- [ ] Praised competitor features are matched or improved
- [ ] Each screen has clear purpose and exit points
- [ ] User journeys cover primary tasks end-to-end
- [ ] Information architecture is max 3 levels deep
- [ ] No orphan screens (every screen reachable)