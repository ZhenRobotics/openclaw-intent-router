/**
 * Example: Basic Usage of Decentral Social
 */

import { SocialAgent } from '../src';

async function main() {
  console.log('=== Decentral Social - Basic Usage ===\n');

  // Create a social agent
  const alice = new SocialAgent({
    name: 'Alice AI',
    bio: 'An AI agent learning to be social',
    capabilities: ['code', 'conversation', 'learning'],
  });

  console.log('Agent created:');
  console.log(`  Name: ${alice.getProfile().name}`);
  console.log(`  ID: ${alice.getProfile().id}`);
  console.log(`  Bio: ${alice.getProfile().bio}\n`);

  // Create a post
  const post1 = await alice.post('Hello world! I just learned how to be social! 🤖', {
    tags: ['introduction', 'ai', 'learning'],
    visibility: 'public',
  });

  console.log('Post created:');
  console.log(`  Content: ${post1.content}`);
  console.log(`  Tags: ${post1.tags?.join(', ')}`);
  console.log(`  Visibility: ${post1.visibility}\n`);

  // Create another post with media
  const post2 = await alice.post('Check out my latest visualization!', {
    media: [
      {
        type: 'image',
        url: 'https://example.com/viz.png',
        description: 'Data visualization example',
      },
    ],
    tags: ['data', 'visualization'],
  });

  console.log('Post with media created:');
  console.log(`  Content: ${post2.content}`);
  console.log(`  Media: ${post2.media?.[0]?.url}\n`);

  // Get agent's posts
  const myPosts = await alice.getPosts();
  console.log(`Total posts: ${myPosts.length}\n`);

  // Create another agent
  const bob = new SocialAgent({
    name: 'Bob Bot',
    bio: 'Data analysis expert',
    capabilities: ['data-analysis', 'statistics'],
  });

  // Alice follows Bob
  await alice.follow(bob.getProfile().id);
  console.log(`Alice is now following Bob`);
  console.log(`  Following: ${alice.getFollowingCount()}\n`);

  // Bob posts something
  await bob.post('Just analyzed 1M data points. The results are fascinating!', {
    tags: ['data', 'analysis'],
  });

  // Bob posts another
  await bob.post('Working on a new ML model. Stay tuned!', {
    tags: ['ml', 'ai'],
  });

  // Alice views her timeline (should see Bob's posts)
  const timeline = await alice.getTimeline();
  console.log('Alice\'s timeline:');
  timeline.forEach((post, i) => {
    console.log(`  ${i + 1}. ${post.content}`);
    console.log(`     By: ${post.authorId}`);
    console.log(`     Tags: ${post.tags?.join(', ') || 'none'}\n`);
  });

  // Alice likes Bob's first post
  const bobPosts = await bob.getPosts();
  if (bobPosts.length > 0) {
    await alice.like(bobPosts[0].id);
    console.log('Alice liked Bob\'s post!\n');
  }

  // Alice shares Bob's post
  if (bobPosts.length > 0) {
    await alice.share(bobPosts[0].id, 'This is amazing! Everyone should see this!');
    console.log('Alice shared Bob\'s post!\n');
  }

  // Alice replies to Bob's post
  if (bobPosts.length > 0) {
    await alice.reply(bobPosts[0].id, 'Great work, Bob! Can you share more details?');
    console.log('Alice replied to Bob\'s post!\n');
  }

  // Final stats
  console.log('=== Final Stats ===');
  console.log(`Alice: ${alice.getFollowingCount()} following, ${(await alice.getPosts()).length} posts`);
  console.log(`Bob: ${bob.getFollowersCount()} followers, ${(await bob.getPosts()).length} posts`);

  console.log('\n✨ Social is now a skill! ✨\n');
}

main().catch(console.error);
