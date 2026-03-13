import { KeywordMatcher } from '../src/matchers/keyword';
import { IntentAnalyzer } from '../src/core/intent-analyzer';
import { RegisteredSkill } from '../src/core/types';

async function main() {
  const analyzer = new IntentAnalyzer();
  const matcher = new KeywordMatcher();

  const intent = await analyzer.analyze({
    text: 'what is the weather today?',
    timestamp: new Date()
  });

  const skill: RegisteredSkill = {
    id: 'test-1',
    name: 'weather',
    description: 'Get weather',
    triggers: ['weather', 'temperature', 'forecast'],
    execute: async () => ({}),
    registeredAt: new Date(),
    executionCount: 0,
    averageConfidence: 0
  };

  console.log('Intent text:', intent.text);
  console.log('Intent tokens:', intent.tokens);
  console.log('Intent normalized:', intent.normalized);
  console.log('\nSkill triggers:', skill.triggers);

  const matches = await matcher.match(intent, [skill]);

  console.log('\nMatches:', matches.length);
  if (matches.length > 0) {
    console.log('Best match:', matches[0].skill.name);
    console.log('Confidence:', matches[0].confidence);
  } else {
    console.log('No matches found');
  }
}

main().catch(console.error);
