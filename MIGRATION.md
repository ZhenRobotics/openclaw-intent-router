# Migration from Video Publisher to Intent Router

This document explains the transformation of this project from a video publishing tool to an Intent Router framework.

## What Changed

### Before: OpenClaw Video Publisher
- Multi-platform video publishing tool
- Upload videos to Douyin, Kuaishou, Bilibili, etc.
- Platform-specific API integrations

### After: Intent Router
- **The Search Layer for Agent Capabilities**
- Intelligent intent-to-skill routing system
- Framework for building AI agent systems

---

## Architecture Transformation

### Previous Architecture
```
User → CLI → Publisher → Platform Adapters → Video APIs
                         (Douyin, Kuaishou, etc.)
```

### New Architecture
```
User Intent → Intent Analyzer → Skill Matcher → Skill Execution
                                (Keyword, Semantic, Hybrid)
```

---

## File Changes

### Removed Files
- `src/platforms/douyin.ts` - Douyin video API
- `src/platforms/kuaishou.ts` - Kuaishou video API
- `publish.sh` - Video publishing script
- `batch-publish.sh` - Batch publishing script
- Video publishing examples

### New Files
- `src/core/router.ts` - Main routing engine
- `src/core/intent-analyzer.ts` - Intent analysis
- `src/skills/registry.ts` - Skill management
- `src/skills/base.ts` - Base skill class
- `src/matchers/*.ts` - Matching strategies
- `src/utils/logger.ts` - Logging utilities
- `examples/basic-router.ts` - Basic usage example
- `examples/custom-skill.ts` - Custom skill creation
- `examples/advanced-matching.ts` - Advanced features
- `config/skills.example.json` - Example skill definitions

### Modified Files
- `package.json` - Updated metadata and scripts
- `README.md` - Complete rewrite for Intent Router
- `QUICKSTART.md` - New quick start guide
- `.gitignore` - Updated for new project structure
- `.env.example` - New environment variables

---

## Core Concepts

### 1. Intent
Natural language expression of what the user wants to accomplish.

```typescript
{
  text: "What is the weather in Paris?",
  context: { location: "user-home" },
  priority: "high"
}
```

### 2. Skill
A discrete capability that can be executed.

```typescript
{
  name: "weather-lookup",
  description: "Get weather information",
  triggers: ["weather", "temperature", "forecast"],
  execute: async (params) => { /* ... */ }
}
```

### 3. Router
Matches intents to skills and manages execution.

```typescript
const router = new IntentRouter();
router.registerSkill(skill);
const result = await router.route(intent);
```

---

## Usage Comparison

### Before (Video Publisher)
```bash
# Upload video to platforms
./publish.sh upload \
  --video my-video.mp4 \
  --title "My Video" \
  --platforms "douyin,kuaishou"
```

### After (Intent Router)
```bash
# Route intent to skills
npx intent-router route "analyze this image for objects"

# List available skills
npx intent-router skills

# Test intent matching
npx intent-router test "what is the weather?"
```

---

## API Comparison

### Before (Platform Adapter)
```typescript
class DouyinPlatform extends BasePlatform {
  async upload(video, metadata) {
    // Upload to Douyin API
  }
}
```

### After (Skill Definition)
```typescript
class ImageAnalysisSkill extends BaseSkill {
  name = 'image-analysis';
  triggers = ['analyze image', 'detect objects'];

  async execute(params) {
    // Analyze image
  }
}
```

---

## Key Features

### Intent Router Features
1. **Intelligent Matching** - Keyword, semantic, and hybrid strategies
2. **Confidence Scoring** - Every match includes confidence score
3. **Skill Registry** - Dynamic skill registration and management
4. **Hooks & Middleware** - Pre/post processing hooks
5. **Fallback Handling** - Graceful handling of unmatched intents
6. **Context Tracking** - Maintain conversation context
7. **Analytics** - Track routing and execution metrics

---

## Migration Path for Users

If you were using the video publisher:

1. **No migration needed** - This is a complete project transformation
2. **Old code preserved** - Check git history for video publisher code
3. **Different purpose** - Intent Router is for agent routing, not video publishing

---

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run examples
npm run dev examples/basic-router.ts

# Use CLI
npm start route "your intent here"
```

---

## Next Steps

1. Read the [README.md](README.md) for full documentation
2. Check [QUICKSTART.md](QUICKSTART.md) for quick start guide
3. Explore [examples/](examples/) for usage patterns
4. Create your own skills using `BaseSkill` class

---

## Questions?

- GitHub Issues: https://github.com/ZhenRobotics/openclaw-intent-router/issues
- Documentation: README.md
- Examples: examples/

---

**The project has been completely transformed from a video publishing tool to a general-purpose intent routing framework for AI agents.**
