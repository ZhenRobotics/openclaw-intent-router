/**
 * Example: Basic Intent Router Usage
 */

import { IntentRouter } from '../src/core/router';
import { SkillDefinition } from '../src/core/types';

async function main() {
  // Create router
  const router = new IntentRouter({
    matchingStrategy: 'hybrid',
    confidenceThreshold: 0.5,
    logLevel: 'info',
  });

  // Register skills
  const weatherSkill: SkillDefinition = {
    name: 'weather-lookup',
    description: 'Get weather information for a location',
    triggers: ['weather', 'temperature', 'forecast'],
    execute: async (params) => {
      console.log('Fetching weather for:', params.location);
      return {
        location: params.location || 'Unknown',
        temperature: 22,
        condition: 'Sunny',
      };
    },
  };

  const imageSkill: SkillDefinition = {
    name: 'image-analysis',
    description: 'Analyze images for objects and content',
    triggers: ['analyze image', 'detect objects', 'what is in'],
    execute: async (params) => {
      console.log('Analyzing image:', params.imageUrl);
      return {
        objects: ['car', 'tree', 'person'],
        confidence: 0.95,
      };
    },
  };

  router.registerSkill(weatherSkill);
  router.registerSkill(imageSkill);

  // Example 1: Route and execute weather query
  console.log('\n--- Example 1: Weather Query ---');
  const result1 = await router.process('What is the weather in Paris?');
  console.log('Result:', result1);

  // Example 2: Route image analysis query
  console.log('\n--- Example 2: Image Analysis ---');
  const result2 = await router.route('What objects are in this photo?');
  console.log('Matched skill:', result2.primary.skill.name);
  console.log('Confidence:', result2.primary.confidence);

  // Example 3: Show all skills
  console.log('\n--- Example 3: All Skills ---');
  const skills = router.getSkills();
  skills.forEach((skill) => {
    console.log(`- ${skill.name}: ${skill.description}`);
  });

  // Example 4: Router statistics
  console.log('\n--- Example 4: Statistics ---');
  const stats = router.getStats();
  console.log(stats);
}

main().catch(console.error);
