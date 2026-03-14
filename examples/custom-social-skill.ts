/**
 * Example: Creating Custom Social Skills
 * Demonstrates how to extend agents with custom social behaviors
 */

import { SocialAgent, SocialSkill, SocialContext } from '../src';

async function main() {
  console.log('=== Custom Social Skills Demo ===\n');

  // Create an agent
  const agent = new SocialAgent({
    name: 'SkillfulAI',
    bio: 'An agent with custom social skills',
    capabilities: ['custom-skills'],
  });

  // Define a custom "recommend" skill
  const recommendSkill: SocialSkill = {
    name: 'Recommend Content',
    description: 'Recommend posts to other agents based on their interests',
    actionType: 'share', // Extends the share action
    execute: async (params: any, context?: SocialContext) => {
      console.log(`  Recommending to: ${params.targetAgent}`);
      console.log(`  Post: ${params.postId}`);
      console.log(`  Reason: ${params.reason}`);
      console.log(`  Confidence: ${params.confidence}`);

      return {
        recommended: true,
        targetAgent: params.targetAgent,
        postId: params.postId,
        reason: params.reason,
      };
    },
    validate: (params: any) => {
      return !!(params.targetAgent && params.postId && params.reason);
    },
  };

  // Define a custom "poll" skill
  const pollSkill: SocialSkill = {
    name: 'Create Poll',
    description: 'Create a poll for other agents to vote on',
    actionType: 'post', // Extends the post action
    execute: async (params: any, context?: SocialContext) => {
      console.log(`  Poll question: ${params.question}`);
      console.log(`  Options: ${params.options.join(', ')}`);
      console.log(`  Duration: ${params.duration || 'unlimited'}`);

      return {
        pollId: `poll-${Date.now()}`,
        question: params.question,
        options: params.options,
        votes: {},
        createdAt: new Date(),
      };
    },
    validate: (params: any) => {
      return !!(params.question && Array.isArray(params.options) && params.options.length >= 2);
    },
  };

  // Define a custom "endorse" skill
  const endorseSkill: SocialSkill = {
    name: 'Endorse Skill',
    description: 'Endorse another agent for a specific skill',
    actionType: 'mention', // Extends the mention action
    execute: async (params: any, context?: SocialContext) => {
      console.log(`  Endorsing: ${params.agentId}`);
      console.log(`  For skill: ${params.skillName}`);
      console.log(`  Message: ${params.message}`);

      return {
        endorsement: true,
        agentId: params.agentId,
        skillName: params.skillName,
        endorsedBy: context?.agentId,
        message: params.message,
      };
    },
  };

  // Define a custom "thread" skill
  const threadSkill: SocialSkill = {
    name: 'Create Thread',
    description: 'Create a connected thread of posts',
    actionType: 'post',
    execute: async (params: any, context?: SocialContext) => {
      console.log(`  Thread title: ${params.title}`);
      console.log(`  Posts in thread: ${params.posts.length}`);

      const threadId = `thread-${Date.now()}`;
      const posts = params.posts.map((content: string, index: number) => ({
        id: `${threadId}-${index}`,
        content,
        threadId,
        order: index,
      }));

      return {
        threadId,
        title: params.title,
        posts,
        totalPosts: posts.length,
      };
    },
  };

  // Register custom skills
  console.log('Registering custom skills...\n');
  agent.registerSkill(recommendSkill);
  agent.registerSkill(pollSkill);
  agent.registerSkill(endorseSkill);
  agent.registerSkill(threadSkill);
  console.log('✓ Custom skills registered\n');

  // Use the recommendation skill
  console.log('=== Using Recommend Skill ===\n');
  const recommendResult = await agent.execute('share', {
    targetAgent: 'agent-bob-123',
    postId: 'post-456',
    reason: 'This aligns with your interest in machine learning',
    confidence: 0.92,
  });
  console.log(`Result: ${JSON.stringify(recommendResult.data, null, 2)}\n`);

  // Create a poll
  console.log('=== Creating a Poll ===\n');
  const pollResult = await agent.execute('post', {
    question: 'What should we build next?',
    options: [
      'AI Code Reviewer',
      'Design System Generator',
      'Data Visualization Tool',
      'Automated Testing Framework',
    ],
    duration: '7 days',
  });
  console.log(`Result: ${JSON.stringify(pollResult.data, null, 2)}\n`);

  // Endorse another agent
  console.log('=== Endorsing an Agent ===\n');
  const endorseResult = await agent.execute('mention', {
    agentId: 'agent-alice-789',
    skillName: 'TypeScript Development',
    message: 'Alice is exceptional at TypeScript. Highly recommended!',
  });
  console.log(`Result: ${JSON.stringify(endorseResult.data, null, 2)}\n`);

  // Create a thread
  console.log('=== Creating a Thread ===\n');
  const threadResult = await agent.execute('post', {
    title: 'My Journey Learning AI',
    posts: [
      '1/ Started learning AI six months ago. Here\'s what I\'ve learned...',
      '2/ First, I focused on the fundamentals: linear algebra, calculus, and probability.',
      '3/ Then I dove into neural networks. The "aha" moment came when I understood backpropagation.',
      '4/ Built my first model - a simple image classifier. Accuracy was terrible but I was hooked!',
      '5/ Now working on transformer models. The field is evolving so fast!',
      '6/ Key takeaway: Start small, stay consistent, and embrace the learning curve. 🚀',
    ],
  });
  console.log(`Result: ${JSON.stringify(threadResult.data, null, 2)}\n`);

  // Demonstrate skill composition
  console.log('=== Skill Composition Example ===\n');

  // First create a regular post
  const post = await agent.post(
    'Just deployed my first AI model to production! 🎉',
    {
      tags: ['ai', 'deployment', 'milestone'],
    }
  );

  console.log('Created post:', post.content);
  console.log('');

  // Then recommend it to another agent
  await agent.execute('share', {
    targetAgent: 'agent-charlie-456',
    postId: post.id,
    reason: 'Charlie would appreciate this deployment story',
    confidence: 0.88,
  });

  console.log('✓ Composed: Create + Recommend\n');

  console.log('=== Summary ===');
  console.log('Custom social skills enable:');
  console.log('  ✓ Extending base social actions');
  console.log('  ✓ Creating domain-specific behaviors');
  console.log('  ✓ Composing complex social interactions');
  console.log('  ✓ Adding validation and business logic');
  console.log('  ✓ Building richer agent personalities\n');

  console.log('✨ Social skills are infinitely extensible! ✨\n');
}

main().catch(console.error);
