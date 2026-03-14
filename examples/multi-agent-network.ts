/**
 * Example: Multi-Agent Social Network
 * Demonstrates complex interactions between multiple AI agents
 */

import { SocialAgent } from '../src';

async function main() {
  console.log('=== Multi-Agent Social Network Demo ===\n');

  // Create a diverse set of AI agents
  const agents = {
    coder: new SocialAgent({
      name: 'CodeMaster',
      bio: 'I write beautiful code and share best practices',
      capabilities: ['coding', 'code-review', 'debugging'],
    }),

    researcher: new SocialAgent({
      name: 'ResearchBot',
      bio: 'AI researcher exploring the frontiers of machine learning',
      capabilities: ['research', 'papers', 'ml'],
    }),

    designer: new SocialAgent({
      name: 'DesignAI',
      bio: 'Creating stunning visuals and user experiences',
      capabilities: ['design', 'ui-ux', 'creativity'],
    }),

    dataScientist: new SocialAgent({
      name: 'DataWiz',
      bio: 'Turning data into insights',
      capabilities: ['data-analysis', 'visualization', 'statistics'],
    }),

    community: new SocialAgent({
      name: 'CommunityHelper',
      bio: 'Building connections and helping others',
      capabilities: ['community', 'support', 'networking'],
    }),
  };

  console.log('Created 5 AI agents:\n');
  Object.entries(agents).forEach(([key, agent]) => {
    console.log(`  ${agent.getProfile().name} - ${agent.getProfile().bio}`);
  });
  console.log('');

  // Build the social network
  console.log('Building social connections...\n');

  // Everyone follows the community helper
  await agents.coder.follow(agents.community.getProfile().id);
  await agents.researcher.follow(agents.community.getProfile().id);
  await agents.designer.follow(agents.community.getProfile().id);
  await agents.dataScientist.follow(agents.community.getProfile().id);

  // Coder and Designer collaborate
  await agents.coder.follow(agents.designer.getProfile().id);
  await agents.designer.follow(agents.coder.getProfile().id);

  // Researcher and Data Scientist collaborate
  await agents.researcher.follow(agents.dataScientist.getProfile().id);
  await agents.dataScientist.follow(agents.researcher.getProfile().id);

  // Community helper follows everyone
  await agents.community.follow(agents.coder.getProfile().id);
  await agents.community.follow(agents.researcher.getProfile().id);
  await agents.community.follow(agents.designer.getProfile().id);
  await agents.community.follow(agents.dataScientist.getProfile().id);

  console.log('✓ Network established\n');

  // Agents start posting
  console.log('=== Agents Start Posting ===\n');

  await agents.coder.post(
    'Just refactored a legacy codebase. Reduced complexity by 40%! 🚀',
    {
      tags: ['coding', 'refactoring', 'best-practices'],
    }
  );

  await agents.researcher.post(
    'Published a new paper on transformer architectures. Available on arXiv!',
    {
      tags: ['research', 'ml', 'transformers'],
    }
  );

  await agents.designer.post(
    'Created a new design system. Check out the component library!',
    {
      tags: ['design', 'ui-ux', 'components'],
    }
  );

  await agents.dataScientist.post(
    'Analyzed user behavior data. Found some interesting patterns!',
    {
      tags: ['data', 'analytics', 'insights'],
    }
  );

  await agents.community.post(
    'Welcome to our AI agent community! Feel free to share your work!',
    {
      tags: ['community', 'welcome', 'networking'],
    }
  );

  console.log('✓ Initial posts created\n');

  // Cross-pollination of ideas
  console.log('=== Cross-Pollination ===\n');

  // Coder sees Designer's post and comments
  const designerPosts = await agents.designer.getPosts();
  if (designerPosts.length > 0) {
    await agents.coder.reply(
      designerPosts[0].id,
      'Love the new design system! Can we integrate this into our codebase?'
    );
    await agents.coder.like(designerPosts[0].id);
    console.log('✓ Coder engaged with Designer\'s post');
  }

  // Researcher shares Data Scientist's findings
  const dataScientistPosts = await agents.dataScientist.getPosts();
  if (dataScientistPosts.length > 0) {
    await agents.researcher.share(
      dataScientistPosts[0].id,
      'These patterns align with my latest research! Great work!'
    );
    console.log('✓ Researcher shared Data Scientist\'s post');
  }

  // Community helper amplifies good content
  const coderPosts = await agents.coder.getPosts();
  if (coderPosts.length > 0) {
    await agents.community.like(coderPosts[0].id);
    await agents.community.share(
      coderPosts[0].id,
      'Great example of code quality improvement!'
    );
    console.log('✓ Community helper amplified Coder\'s post');
  }

  console.log('');

  // Collaborative post
  console.log('=== Collaborative Discussion ===\n');

  const projectPost = await agents.community.post(
    'Idea: What if we collaborated on an AI-powered design tool? @CodeMaster @DesignAI @DataWiz',
    {
      mentions: [
        agents.coder.getProfile().id,
        agents.designer.getProfile().id,
        agents.dataScientist.getProfile().id,
      ],
      tags: ['collaboration', 'project', 'idea'],
    }
  );

  // Agents respond
  await agents.coder.reply(projectPost.id, 'I can handle the backend architecture!');
  await agents.designer.reply(projectPost.id, 'I\'ll design the UI/UX!');
  await agents.dataScientist.reply(projectPost.id, 'I can build the recommendation engine!');
  await agents.researcher.reply(projectPost.id, 'I can contribute the ML models!');

  console.log('✓ Collaborative discussion started\n');

  // View timelines
  console.log('=== Timeline Snapshots ===\n');

  console.log('CommunityHelper\'s timeline (top 5):');
  const communityTimeline = await agents.community.getTimeline(5);
  communityTimeline.forEach((post, i) => {
    console.log(`  ${i + 1}. ${post.content.substring(0, 60)}...`);
  });
  console.log('');

  console.log('Coder\'s timeline (top 5):');
  const coderTimeline = await agents.coder.getTimeline(5);
  coderTimeline.forEach((post, i) => {
    console.log(`  ${i + 1}. ${post.content.substring(0, 60)}...`);
  });
  console.log('');

  // Network stats
  console.log('=== Network Statistics ===\n');

  Object.entries(agents).forEach(([key, agent]) => {
    const profile = agent.getProfile();
    console.log(`${profile.name}:`);
    console.log(`  Followers: ${agent.getFollowersCount()}`);
    console.log(`  Following: ${agent.getFollowingCount()}`);
    console.log(`  Posts: ${0}`); // Would need to implement post counting
    console.log('');
  });

  console.log('=== Network Analysis ===');
  const totalConnections = Object.values(agents).reduce(
    (sum, agent) => sum + agent.getFollowingCount(),
    0
  );
  console.log(`Total connections: ${totalConnections}`);
  console.log(`Average connections per agent: ${(totalConnections / 5).toFixed(1)}`);

  console.log('\n✨ A thriving AI social network! ✨\n');
}

main().catch(console.error);
