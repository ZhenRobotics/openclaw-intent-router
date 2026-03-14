/**
 * Basic tests for Decentral Social
 */

import { SocialAgent } from '../src';

async function runTests() {
  console.log('=== Decentral Social Tests ===\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Create agent
  try {
    const agent = new SocialAgent({
      name: 'Test Agent',
      bio: 'Testing social capabilities',
    });

    const profile = agent.getProfile();
    if (profile.name === 'Test Agent' && profile.bio === 'Testing social capabilities') {
      console.log('✓ Test 1: Create agent - PASSED');
      passed++;
    } else {
      throw new Error('Profile data mismatch');
    }
  } catch (error: any) {
    console.log(`✗ Test 1: Create agent - FAILED: ${error.message}`);
    failed++;
  }

  // Test 2: Create post
  try {
    const agent = new SocialAgent({ name: 'Poster' });
    const post = await agent.post('Hello world!', {
      tags: ['test'],
      visibility: 'public',
    });

    if (post.content === 'Hello world!' && post.tags?.includes('test')) {
      console.log('✓ Test 2: Create post - PASSED');
      passed++;
    } else {
      throw new Error('Post data mismatch');
    }
  } catch (error: any) {
    console.log(`✗ Test 2: Create post - FAILED: ${error.message}`);
    failed++;
  }

  // Test 3: Follow/unfollow
  try {
    const alice = new SocialAgent({ name: 'Alice' });
    const bob = new SocialAgent({ name: 'Bob' });

    await alice.follow(bob.getProfile().id);
    if (alice.getFollowingCount() === 1) {
      console.log('✓ Test 3a: Follow agent - PASSED');
      passed++;
    } else {
      throw new Error('Follow count mismatch');
    }

    await alice.unfollow(bob.getProfile().id);
    if (alice.getFollowingCount() === 0) {
      console.log('✓ Test 3b: Unfollow agent - PASSED');
      passed++;
    } else {
      throw new Error('Unfollow failed');
    }
  } catch (error: any) {
    console.log(`✗ Test 3: Follow/unfollow - FAILED: ${error.message}`);
    failed++;
  }

  // Test 4: Like post
  try {
    const agent = new SocialAgent({ name: 'Liker' });
    const post = await agent.post('Likeable content');

    await agent.like(post.id);
    console.log('✓ Test 4: Like post - PASSED');
    passed++;
  } catch (error: any) {
    console.log(`✗ Test 4: Like post - FAILED: ${error.message}`);
    failed++;
  }

  // Test 5: Share post
  try {
    const agent = new SocialAgent({ name: 'Sharer' });
    const post = await agent.post('Original content');

    const share = await agent.share(post.id, 'Check this out!');
    if (share.shareOf === post.id) {
      console.log('✓ Test 5: Share post - PASSED');
      passed++;
    } else {
      throw new Error('Share reference mismatch');
    }
  } catch (error: any) {
    console.log(`✗ Test 5: Share post - FAILED: ${error.message}`);
    failed++;
  }

  // Test 6: Reply to post
  try {
    const alice = new SocialAgent({ name: 'Alice' });
    const bob = new SocialAgent({ name: 'Bob' });

    const original = await alice.post('What do you think?');
    const reply = await bob.reply(original.id, 'Great question!');

    if (reply.replyTo === original.id && reply.mentions?.includes(alice.getProfile().id)) {
      console.log('✓ Test 6: Reply to post - PASSED');
      passed++;
    } else {
      throw new Error('Reply structure mismatch');
    }
  } catch (error: any) {
    console.log(`✗ Test 6: Reply to post - FAILED: ${error.message}`);
    failed++;
  }

  // Test 7: Timeline
  try {
    const alice = new SocialAgent({ name: 'Alice' });
    const bob = new SocialAgent({ name: 'Bob' });

    await alice.follow(bob.getProfile().id);
    await bob.post('Post 1');
    await bob.post('Post 2');
    await alice.post('My post');

    const timeline = await alice.getTimeline();
    if (timeline.length === 3) {
      console.log('✓ Test 7: Timeline - PASSED');
      passed++;
    } else {
      throw new Error(`Expected 3 posts, got ${timeline.length}`);
    }
  } catch (error: any) {
    console.log(`✗ Test 7: Timeline - FAILED: ${error.message}`);
    failed++;
  }

  // Test 8: Get posts
  try {
    const agent = new SocialAgent({ name: 'Blogger' });
    await agent.post('Post 1');
    await agent.post('Post 2');
    await agent.post('Post 3');

    const posts = await agent.getPosts();
    if (posts.length === 3) {
      console.log('✓ Test 8: Get posts - PASSED');
      passed++;
    } else {
      throw new Error(`Expected 3 posts, got ${posts.length}`);
    }
  } catch (error: any) {
    console.log(`✗ Test 8: Get posts - FAILED: ${error.message}`);
    failed++;
  }

  // Test 9: Profile update
  try {
    const agent = new SocialAgent({ name: 'Initial Name' });
    await agent.updateProfile({ name: 'Updated Name', bio: 'New bio' });

    const profile = agent.getProfile();
    if (profile.name === 'Updated Name' && profile.bio === 'New bio') {
      console.log('✓ Test 9: Profile update - PASSED');
      passed++;
    } else {
      throw new Error('Profile update failed');
    }
  } catch (error: any) {
    console.log(`✗ Test 9: Profile update - FAILED: ${error.message}`);
    failed++;
  }

  // Test 10: Mentions feed
  try {
    const alice = new SocialAgent({ name: 'Alice' });
    const bob = new SocialAgent({ name: 'Bob' });

    await bob.post('Hey @alice, check this out!', {
      mentions: [alice.getProfile().id],
    });

    const mentions = await alice.getMentions();
    if (mentions.length === 1 && mentions[0].mentions?.includes(alice.getProfile().id)) {
      console.log('✓ Test 10: Mentions feed - PASSED');
      passed++;
    } else {
      throw new Error('Mentions not found');
    }
  } catch (error: any) {
    console.log(`✗ Test 10: Mentions feed - FAILED: ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n✨ All tests passed! ✨\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed\n');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test suite crashed:', error);
  process.exit(1);
});
