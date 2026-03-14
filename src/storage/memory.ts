/**
 * Decentral Social - In-Memory Storage
 */

import {
  AgentProfile,
  SocialPost,
  SocialInteraction,
  SocialActionType,
  ISocialStorage,
} from '../core/types';

/**
 * Simple in-memory storage implementation
 */
export class MemoryStorage implements ISocialStorage {
  private agents: Map<string, AgentProfile> = new Map();
  private posts: Map<string, SocialPost> = new Map();
  private interactions: Map<string, SocialInteraction> = new Map();
  private postsByAgent: Map<string, string[]> = new Map();

  // Agents
  async saveAgent(agent: AgentProfile): Promise<void> {
    this.agents.set(agent.id, agent);
  }

  async getAgent(agentId: string): Promise<AgentProfile | null> {
    return this.agents.get(agentId) || null;
  }

  async searchAgents(query: string): Promise<AgentProfile[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.agents.values()).filter(
      (agent) =>
        agent.name.toLowerCase().includes(lowerQuery) ||
        agent.bio?.toLowerCase().includes(lowerQuery)
    );
  }

  // Posts
  async savePost(post: SocialPost): Promise<void> {
    this.posts.set(post.id, post);

    // Index by author
    const authorPosts = this.postsByAgent.get(post.authorId) || [];
    authorPosts.unshift(post.id); // Add to beginning (newest first)
    this.postsByAgent.set(post.authorId, authorPosts);
  }

  async getPost(postId: string): Promise<SocialPost | null> {
    return this.posts.get(postId) || null;
  }

  async getPosts(agentId: string, limit: number = 20): Promise<SocialPost[]> {
    const postIds = this.postsByAgent.get(agentId) || [];
    return postIds
      .slice(0, limit)
      .map((id) => this.posts.get(id))
      .filter((post): post is SocialPost => post !== undefined);
  }

  async deletPost(postId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      this.posts.delete(postId);

      // Remove from author index
      const authorPosts = this.postsByAgent.get(post.authorId) || [];
      this.postsByAgent.set(
        post.authorId,
        authorPosts.filter((id) => id !== postId)
      );
    }
  }

  // Interactions
  async saveInteraction(interaction: SocialInteraction): Promise<void> {
    this.interactions.set(interaction.id, interaction);
  }

  async getInteractions(
    agentId: string,
    type?: SocialActionType
  ): Promise<SocialInteraction[]> {
    return Array.from(this.interactions.values()).filter(
      (interaction) =>
        interaction.actorId === agentId && (!type || interaction.type === type)
    );
  }

  // Feed
  async getFeed(
    agentId: string,
    type: 'timeline' | 'mentions',
    limit: number = 20
  ): Promise<SocialPost[]> {
    if (type === 'timeline') {
      return this.getTimelineFeed(agentId, limit);
    } else {
      return this.getMentionsFeed(agentId, limit);
    }
  }

  private async getTimelineFeed(agentId: string, limit: number): Promise<SocialPost[]> {
    const agent = await this.getAgent(agentId);
    if (!agent) return [];

    // Get posts from followed agents and self
    const followingIds = [...(agent.following || []), agentId];
    const posts: SocialPost[] = [];

    for (const followedId of followingIds) {
      const agentPosts = await this.getPosts(followedId, 100);
      posts.push(...agentPosts);
    }

    // Sort by creation date (newest first) and limit
    return posts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  private async getMentionsFeed(agentId: string, limit: number): Promise<SocialPost[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.mentions?.includes(agentId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.agents.clear();
    this.posts.clear();
    this.interactions.clear();
    this.postsByAgent.clear();
  }

  /**
   * Get storage statistics
   */
  getStats() {
    return {
      agents: this.agents.size,
      posts: this.posts.size,
      interactions: this.interactions.size,
    };
  }
}
