# Quick Start Guide

Get up and running with Intent Router in 5 minutes.

## Installation

```bash
npm install openclaw-intent-router
```

Or clone and build locally:

```bash
git clone https://github.com/ZhenRobotics/openclaw-intent-router.git
cd openclaw-intent-router
npm install
npm run build
```

---

## Basic Usage

### 1. Create a Router

```typescript
import { IntentRouter } from 'openclaw-intent-router';

const router = new IntentRouter({
  matchingStrategy: 'hybrid',  // 'keyword' | 'semantic' | 'hybrid'
  confidenceThreshold: 0.6,
  logLevel: 'info'
});
```

### 2. Register Skills

```typescript
router.registerSkill({
  name: 'weather-lookup',
  description: 'Get weather information for a location',
  triggers: ['weather', 'temperature', 'forecast'],
  execute: async (params) => {
    // Your skill logic here
    return await getWeather(params.location);
  }
});
```

### 3. Route Intents

```typescript
// Route an intent
const result = await router.route('What is the weather in Paris?');

console.log(result.primary.skill.name);  // 'weather-lookup'
console.log(result.primary.confidence);  // 0.95
```

### 4. Execute Skills

```typescript
// Route and execute in one call
const execution = await router.process('What is the weather in Paris?');

if (execution.success) {
  console.log(execution.data);  // Weather data
} else {
  console.error(execution.error);
}
```

---

## CLI Usage

### Interactive Mode

```bash
# Start the CLI
npx intent-router route "analyze this image for objects"
```

### List Skills

```bash
npx intent-router skills
```

### Test Matching

```bash
npx intent-router test "what is the weather today?" --verbose
```

### Load Custom Skills

```bash
npx intent-router route "translate to spanish" --config ./my-skills.json
```

---

## Configuration File

Create `skills.json`:

```json
{
  "skills": [
    {
      "name": "weather-lookup",
      "description": "Get weather information",
      "triggers": ["weather", "temperature", "forecast"],
      "parameters": {
        "location": {
          "type": "string",
          "required": true
        }
      }
    }
  ]
}
```

Load it:

```typescript
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./skills.json', 'utf-8'));

config.skills.forEach(skill => {
  router.registerSkill({
    ...skill,
    execute: async (params) => {
      // Your implementation
    }
  });
});
```

---

## Advanced Features

### Hooks

```typescript
// Before routing
router.use('before-route', (data) => {
  console.log('Routing:', data.intent.text);
});

// After execution
router.use('after-execute', (data) => {
  logAnalytics(data.result);
});
```

### Fallback Handler

```typescript
router.setFallback({
  threshold: 0.6,
  handler: async (intent) => {
    return "I'm not sure how to help with that.";
  }
});
```

### Custom Matcher

```typescript
import { KeywordMatcher } from 'openclaw-intent-router';

const customMatcher = new KeywordMatcher();
router.setMatcher(customMatcher);
```

---

## Examples

Check the `examples/` directory:

- `basic-router.ts` - Simple routing setup
- `custom-skill.ts` - Creating custom skills
- `advanced-matching.ts` - Hooks and fallbacks

Run examples:

```bash
npm run dev examples/basic-router.ts
```

---

## Next Steps

- Read the [full documentation](README.md)
- Explore [API reference](docs/API.md)
- Check out [example skills](examples/)
- Join the [community](https://github.com/ZhenRobotics/openclaw-intent-router/discussions)

---

Happy routing! 🚀
