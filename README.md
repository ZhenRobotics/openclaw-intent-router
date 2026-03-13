# Intent Router

> **The Search Layer for Agent Capabilities**

Intelligent routing system that analyzes user intents and matches them to the most appropriate agent skills and capabilities.

---

## What is Intent Router?

Intent Router is a **capability discovery and routing framework** for AI agents. It solves the fundamental problem: *"Given a user's intent, which agent skill should handle this request?"*

Think of it as a **smart dispatcher** that:
- Analyzes natural language intents
- Matches intents to registered skills
- Routes requests to the best-fit capability
- Provides confidence scores and fallbacks

---

## Core Concepts

### 1. Intent
A user's goal expressed in natural language.

```typescript
{
  text: "I need to analyze this image for objects",
  context: { imageUrl: "...", format: "jpg" },
  priority: "high"
}
```

### 2. Skill
A discrete capability that an agent can perform.

```typescript
{
  name: "image-object-detection",
  description: "Detect and classify objects in images",
  triggers: ["detect objects", "identify items", "what's in this image"],
  parameters: { imageUrl: string, threshold?: number },
  execute: async (params) => { ... }
}
```

### 3. Router
The matching engine that connects intents to skills.

```typescript
const result = await router.route("what objects are in this photo?");
// => { skill: "image-object-detection", confidence: 0.95 }
```

---

## Quick Start

### Installation

```bash
npm install openclaw-intent-router
```

### Basic Usage

```typescript
import { IntentRouter, Skill } from 'openclaw-intent-router';

// 1. Create router
const router = new IntentRouter();

// 2. Register skills
router.registerSkill({
  name: 'weather-lookup',
  description: 'Get current weather for a location',
  triggers: ['weather', 'temperature', 'forecast'],
  execute: async (params) => {
    return await fetchWeather(params.location);
  }
});

// 3. Route intent
const result = await router.route('What is the weather in Paris?');

// 4. Execute matched skill
const response = await result.skill.execute(result.params);
```

---

## Features

### Intelligent Matching

Multiple matching strategies:
- **Keyword matching** - Trigger words and phrases
- **Semantic similarity** - Embedding-based intent understanding
- **Context awareness** - Previous conversation history
- **Parameter extraction** - Automatic entity recognition

```typescript
router.route("book a flight to Tokyo next Tuesday")
// => Skill: travel-booking
// => Params: { destination: "Tokyo", date: "2024-01-16" }
```

### Confidence Scoring

Every match includes a confidence score:

```typescript
{
  skill: "weather-lookup",
  confidence: 0.95,
  alternativeSkills: [
    { skill: "general-search", confidence: 0.45 }
  ]
}
```

### Fallback Handling

```typescript
router.setFallback({
  threshold: 0.6,  // Minimum confidence
  handler: async (intent) => {
    return "I'm not sure how to help with that. Can you rephrase?";
  }
});
```

### Middleware & Hooks

```typescript
// Pre-routing hook
router.use('before-route', (intent) => {
  console.log('Processing:', intent.text);
});

// Post-execution hook
router.use('after-execute', (result) => {
  logAnalytics(result);
});
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           User Intent (Natural Language)    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Intent Analyzer                     │
│  - Tokenization                             │
│  - Entity Extraction                        │
│  - Context Enrichment                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Skill Matcher                       │
│  - Keyword Matching                         │
│  - Semantic Similarity                      │
│  - Confidence Scoring                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Router Decision                     │
│  - Best Skill Selection                     │
│  - Parameter Binding                        │
│  - Fallback Handling                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Skill Execution                     │
│  - Input Validation                         │
│  - Execute Handler                          │
│  - Response Formatting                      │
└─────────────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── core/
│   ├── types.ts           # Core type definitions
│   ├── router.ts          # Main routing engine
│   ├── intent-analyzer.ts # Intent parsing & analysis
│   └── skill-matcher.ts   # Skill matching algorithms
│
├── skills/
│   ├── base.ts            # Base skill class
│   └── registry.ts        # Skill registration system
│
├── matchers/
│   ├── keyword.ts         # Keyword-based matching
│   ├── semantic.ts        # Embedding-based matching
│   └── hybrid.ts          # Combined strategy
│
└── cli/
    └── index.ts           # CLI interface

config/
└── skills.json            # Skill definitions

examples/
├── basic-router.ts
├── custom-skill.ts
└── advanced-matching.ts
```

---

## Configuration

### Router Configuration

```typescript
const router = new IntentRouter({
  matchingStrategy: 'hybrid',       // 'keyword' | 'semantic' | 'hybrid'
  confidenceThreshold: 0.6,
  maxAlternatives: 3,
  enableContextTracking: true,
  logLevel: 'info'
});
```

### Skill Configuration

```json
{
  "skills": [
    {
      "name": "code-generator",
      "description": "Generate code from natural language descriptions",
      "triggers": ["write code", "generate function", "create class"],
      "parameters": {
        "language": { "type": "string", "required": true },
        "description": { "type": "string", "required": true }
      },
      "examples": [
        "write a Python function to sort a list",
        "generate a React component for a button"
      ]
    }
  ]
}
```

---

## Advanced Usage

### Custom Matching Strategy

```typescript
import { BaseMatcher } from 'openclaw-intent-router';

class CustomMatcher extends BaseMatcher {
  async match(intent: Intent, skills: Skill[]): Promise<MatchResult> {
    // Your custom matching logic
    return {
      skill: bestSkill,
      confidence: score,
      params: extractedParams
    };
  }
}

router.setMatcher(new CustomMatcher());
```

### Skill Composition

```typescript
// Create composite skill
const complexSkill = router.composeSkills(
  'multi-step-task',
  ['skill-a', 'skill-b', 'skill-c'],
  {
    strategy: 'sequential',  // or 'parallel'
    onError: 'rollback'
  }
);
```

### Context Management

```typescript
// Maintain conversation context
const session = router.createSession();

await session.route("What's the weather?");
await session.route("How about tomorrow?");  // Uses context
await session.route("And in Tokyo?");        // Inherits location context
```

---

## CLI Usage

```bash
# Start interactive mode
intent-router interactive

# Route a single intent
intent-router route "analyze this image for sentiment"

# List registered skills
intent-router skills

# Test skill matching
intent-router test --intent "book a flight" --verbose

# Load skills from config
intent-router load --config ./skills.json
```

---

## Use Cases

### 1. Multi-Agent Systems
Route user requests to specialized sub-agents (code, research, image, etc.)

### 2. Chatbot Frameworks
Determine which intent handler should process user messages

### 3. API Gateway
Intelligent routing to microservices based on request intent

### 4. Voice Assistants
Map voice commands to appropriate action handlers

### 5. Workflow Automation
Trigger automation based on natural language triggers

---

## API Reference

### IntentRouter

```typescript
class IntentRouter {
  registerSkill(skill: SkillDefinition): void
  route(intent: string | Intent): Promise<RouteResult>
  execute(routeResult: RouteResult): Promise<any>
  setMatcher(matcher: BaseMatcher): void
  setFallback(config: FallbackConfig): void
  use(hook: string, handler: Function): void
}
```

### Skill

```typescript
interface Skill {
  name: string
  description: string
  triggers: string[]
  parameters?: ParameterSchema
  execute: (params: any) => Promise<any>
  validate?: (params: any) => boolean
}
```

### Intent

```typescript
interface Intent {
  text: string
  context?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
  timestamp?: Date
}
```

---

## Examples

Check the `examples/` directory for:
- Basic routing setup
- Custom skill creation
- Advanced matching strategies
- Multi-turn conversations
- Error handling patterns

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## License

MIT

---

## Links

- **Documentation**: [https://intent-router.openclaw.dev](https://intent-router.openclaw.dev)
- **GitHub**: [https://github.com/ZhenRobotics/openclaw-intent-router](https://github.com/ZhenRobotics/openclaw-intent-router)
- **Issues**: [https://github.com/ZhenRobotics/openclaw-intent-router/issues](https://github.com/ZhenRobotics/openclaw-intent-router/issues)

---

**Route smarter. Execute faster. Build better agents.**
