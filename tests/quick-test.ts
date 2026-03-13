import { IntentRouter } from '../src/core/router';

async function main() {
  console.log('Testing Intent Router...\n');

  const router = new IntentRouter({ logLevel: 'info' });

  // Register test skill
  router.registerSkill({
    name: 'test-skill',
    description: 'Test skill for verification',
    triggers: ['test', 'hello', 'world'],
    execute: async () => ({ message: 'Success!' })
  });

  // Test routing
  const result = await router.route('hello world test');

  console.log('\n✅ Router works!');
  console.log('Matched skill:', result.primary.skill.name);
  console.log('Confidence:', result.primary.confidence.toFixed(2));
}

main().catch(console.error);
