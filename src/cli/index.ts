#!/usr/bin/env node

/**
 * Intent Router - CLI Interface
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { IntentRouter } from '../core/router';
import { SkillDefinition } from '../core/types';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('intent-router')
  .description('Intent Router - The Search Layer for Agent Capabilities')
  .version('1.0.0');

/**
 * Route command - Route a single intent
 */
program
  .command('route')
  .description('Route an intent to the best matching skill')
  .argument('<intent>', 'The intent to route')
  .option('-v, --verbose', 'Show detailed matching information')
  .option('-c, --config <path>', 'Path to skills configuration file')
  .action(async (intent: string, options) => {
    try {
      const router = new IntentRouter({
        logLevel: options.verbose ? 'debug' : 'info',
      });

      // Load skills if config provided
      if (options.config) {
        loadSkillsFromConfig(router, options.config);
      } else {
        loadDefaultSkills(router);
      }

      console.log(`\nRouting intent: "${intent}"\n`);

      const result = await router.route(intent);

      console.log('Primary Match:');
      console.log(`  Skill: ${result.primary.skill.name}`);
      console.log(`  Confidence: ${result.primary.confidence.toFixed(2)}`);
      console.log(`  Description: ${result.primary.skill.description}`);

      if (result.primary.params && Object.keys(result.primary.params).length > 0) {
        console.log(`  Parameters:`, result.primary.params);
      }

      if (result.alternatives.length > 0) {
        console.log('\nAlternatives:');
        result.alternatives.forEach((alt, i) => {
          console.log(
            `  ${i + 1}. ${alt.skill.name} (${alt.confidence.toFixed(2)})`
          );
        });
      }

      console.log(`\nProcessing time: ${result.processingTime}ms\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Process command - Route and execute
 */
program
  .command('process')
  .description('Route and execute an intent')
  .argument('<intent>', 'The intent to process')
  .option('-c, --config <path>', 'Path to skills configuration file')
  .action(async (intent: string, options) => {
    try {
      const router = new IntentRouter();

      if (options.config) {
        loadSkillsFromConfig(router, options.config);
      } else {
        loadDefaultSkills(router);
      }

      console.log(`\nProcessing intent: "${intent}"\n`);

      const result = await router.process(intent);

      if (result.success) {
        console.log(`Success! Skill: ${result.skill}`);
        console.log(`Result:`, result.data);
      } else {
        console.log(`Failed: ${result.error}`);
      }

      console.log(`\nExecution time: ${result.executionTime}ms\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Skills command - List registered skills
 */
program
  .command('skills')
  .description('List all registered skills')
  .option('-c, --config <path>', 'Path to skills configuration file')
  .option('-s, --search <query>', 'Search skills by query')
  .action((options) => {
    try {
      const router = new IntentRouter({ logLevel: 'silent' });

      if (options.config) {
        loadSkillsFromConfig(router, options.config);
      } else {
        loadDefaultSkills(router);
      }

      let skills = router.getSkills();

      if (options.search) {
        skills = skills.filter(
          (s) =>
            s.name.toLowerCase().includes(options.search.toLowerCase()) ||
            s.description.toLowerCase().includes(options.search.toLowerCase())
        );
      }

      console.log(`\nRegistered Skills (${skills.length}):\n`);

      skills.forEach((skill, i) => {
        console.log(`${i + 1}. ${skill.name}`);
        console.log(`   Description: ${skill.description}`);
        console.log(`   Triggers: ${skill.triggers.join(', ')}`);
        if (skill.executionCount > 0) {
          console.log(`   Executions: ${skill.executionCount}`);
          console.log(
            `   Avg Confidence: ${skill.averageConfidence.toFixed(2)}`
          );
        }
        console.log('');
      });
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Test command - Test skill matching
 */
program
  .command('test')
  .description('Test intent matching against all skills')
  .argument('<intent>', 'The intent to test')
  .option('-c, --config <path>', 'Path to skills configuration file')
  .action(async (intent: string, options) => {
    try {
      const router = new IntentRouter({ logLevel: 'silent' });

      if (options.config) {
        loadSkillsFromConfig(router, options.config);
      } else {
        loadDefaultSkills(router);
      }

      console.log(`\nTesting intent: "${intent}"\n`);

      const result = await router.route(intent);

      console.log('All Matches:\n');
      const allMatches = [result.primary, ...result.alternatives];

      allMatches.forEach((match, i) => {
        console.log(`${i + 1}. ${match.skill.name}`);
        console.log(`   Confidence: ${match.confidence.toFixed(3)}`);
        console.log(`   Description: ${match.skill.description}`);
        if (match.matchedTriggers && match.matchedTriggers.length > 0) {
          console.log(`   Matched: ${match.matchedTriggers.join(', ')}`);
        }
        console.log('');
      });
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Stats command - Show router statistics
 */
program
  .command('stats')
  .description('Show router statistics')
  .option('-c, --config <path>', 'Path to skills configuration file')
  .action((options) => {
    try {
      const router = new IntentRouter({ logLevel: 'silent' });

      if (options.config) {
        loadSkillsFromConfig(router, options.config);
      } else {
        loadDefaultSkills(router);
      }

      const stats = router.getStats();

      console.log('\nRouter Statistics:\n');
      console.log(`  Total Skills: ${stats.totalSkills}`);
      console.log(`  Enabled Skills: ${stats.enabledSkills}`);
      console.log(`  Total Executions: ${stats.totalExecutions}`);
      console.log(
        `  Average Confidence: ${stats.averageConfidence.toFixed(2)}`
      );
      console.log('');
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Load skills from configuration file
 */
function loadSkillsFromConfig(router: IntentRouter, configPath: string): void {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  if (!config.skills || !Array.isArray(config.skills)) {
    throw new Error('Invalid config format: missing skills array');
  }

  config.skills.forEach((skill: any) => {
    router.registerSkill({
      ...skill,
      execute: async (params: any) => {
        return { message: `Executed ${skill.name}`, params };
      },
    });
  });

  console.log(`Loaded ${config.skills.length} skills from ${configPath}\n`);
}

/**
 * Load default demo skills
 */
function loadDefaultSkills(router: IntentRouter): void {
  const demoSkills: SkillDefinition[] = [
    {
      name: 'weather-lookup',
      description: 'Get weather information for a location',
      triggers: ['weather', 'temperature', 'forecast', 'climate'],
      examples: ['What is the weather in Paris?', 'temperature in Tokyo'],
      execute: async (params) => {
        return { weather: 'sunny', temperature: 22, location: params.location };
      },
    },
    {
      name: 'image-analysis',
      description: 'Analyze images for objects, faces, or text',
      triggers: ['analyze image', 'detect objects', 'identify', 'what is in'],
      examples: ['analyze this image', 'what objects are in this photo'],
      execute: async (params) => {
        return { objects: ['car', 'tree', 'person'], confidence: 0.95 };
      },
    },
    {
      name: 'code-generator',
      description: 'Generate code from natural language descriptions',
      triggers: ['write code', 'generate function', 'create script', 'code'],
      examples: ['write a Python function to sort a list'],
      execute: async (params) => {
        return { code: 'def sort_list(lst):\n    return sorted(lst)' };
      },
    },
  ];

  demoSkills.forEach((skill) => router.registerSkill(skill));
}

program.parse();
