/**
 * Example: Advanced Matching with Hooks and Fallbacks
 */

import { IntentRouter } from '../src/core/router';
import { SkillDefinition } from '../src/core/types';

async function main() {
  const router = new IntentRouter({
    matchingStrategy: 'hybrid',
    confidenceThreshold: 0.6,
    maxAlternatives: 5,
    logLevel: 'debug',
  });

  // Register multiple skills
  const skills: SkillDefinition[] = [
    {
      name: 'weather',
      description: 'Get weather information',
      triggers: ['weather', 'temperature', 'forecast'],
      execute: async () => ({ temp: 22, condition: 'sunny' }),
    },
    {
      name: 'news',
      description: 'Get latest news',
      triggers: ['news', 'headlines', 'current events'],
      execute: async () => ({ headlines: ['News 1', 'News 2'] }),
    },
    {
      name: 'calculator',
      description: 'Perform calculations',
      triggers: ['calculate', 'compute', 'math'],
      execute: async (params) => ({ result: eval(params.expression) }),
    },
    {
      name: 'translator',
      description: 'Translate text',
      triggers: ['translate', 'translation', 'in spanish'],
      execute: async () => ({ translation: 'Hola' }),
    },
  ];

  skills.forEach((skill) => router.registerSkill(skill));

  // Add hooks
  router.use('before-route', (data) => {
    console.log('\n[HOOK] Before routing:', data.intent.text);
  });

  router.use('after-route', (data) => {
    console.log('[HOOK] After routing - Best match:', data.result.primary.skill.name);
  });

  router.use('before-execute', (data) => {
    console.log('[HOOK] Before executing:', data.routeResult.primary.skill.name);
  });

  router.use('after-execute', (data) => {
    console.log('[HOOK] After executing - Success:', data.result.success);
  });

  router.use('on-error', (data) => {
    console.log('[HOOK] Error occurred:', data.error.message);
  });

  // Set fallback handler
  router.setFallback({
    threshold: 0.6,
    handler: async (intent) => {
      console.log('Fallback triggered for:', intent.text);
      return { message: 'Sorry, I could not understand that.' };
    },
  });

  // Test various intents
  const testIntents = [
    'What is the weather today?',
    'Show me the latest news',
    'Calculate 15 * 23',
    'Translate hello to Spanish',
    'This is a completely random query that should not match anything',
  ];

  for (const intent of testIntents) {
    console.log('\n' + '='.repeat(60));
    console.log('Testing intent:', intent);
    console.log('='.repeat(60));

    try {
      const result = await router.route(intent);
      console.log('\nMatched skill:', result.primary.skill.name);
      console.log('Confidence:', result.primary.confidence.toFixed(3));

      if (result.alternatives.length > 0) {
        console.log('\nAlternatives:');
        result.alternatives.forEach((alt, i) => {
          console.log(`  ${i + 1}. ${alt.skill.name} (${alt.confidence.toFixed(3)})`);
        });
      }
    } catch (error: any) {
      console.log('\nNo match found:', error.message);
    }
  }

  // Show final statistics
  console.log('\n' + '='.repeat(60));
  console.log('Final Statistics');
  console.log('='.repeat(60));
  const stats = router.getStats();
  console.log(stats);
}

main().catch(console.error);
