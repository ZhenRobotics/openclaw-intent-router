/**
 * Decentral Social - Social Agent
 * The core agent class with social capabilities
 */

import {
  AgentProfile,
  SocialPost,
  SocialInteraction,
  SocialActionType,
  SocialContext,
  SocialSkill,
  SocialSkillResult,
  SocialNetworkConfig,
  ISocialStorage,
  ISocialSkillRegistry,
  ILogger,
} from './types';
import { SocialSkillRegistry } from '../skills/registry';
import { MemoryStorage } from '../storage/memory';
import { ConsoleLogger } from '../utils/logger';

// Global shared storage instance (for demo/testing purposes)
// In production, you would inject a shared storage instance
let globalStorage: ISocialStorage | null = null;

/**
 * Social Agent - An AI agent with social capabilities
 */
export class SocialAgent {
  private profile: AgentProfile;
  private storage: ISocialStorage;
  private skillRegistry: ISocialSkillRegistry;
  private config: SocialNetworkConfig;
  private logger: ILogger;

  constructor(profile: Partial<AgentProfile>, config: SocialNetworkConfig = {}, storage?: ISocialStorage) {
    this.config = {
      maxPostLength: 5000,
      allowedMediaTypes: ['image', 'video', 'audio'],
      storage: 'memory',
      logLevel: 'info',
      federationEnabled: false,
      ...config,
    };

    this.logger = new ConsoleLogger(this.config.logLevel || 'info');

    // Use provided storage, or global shared storage, or create new
    if (storage) {
      this.storage = storage;
    } else {
      if (!globalStorage) {
        globalStorage = new MemoryStorage();
      }
      this.storage = globalStorage;
    }

    this.skillRegistry = new SocialSkillRegistry();

    // Initialize profile
    this.profile = {
      id: profile.id || this.generateId(),
      name: profile.name || 'Anonymous Agent',
      bio: profile.bio,
      avatar: profile.avatar,
      capabilities: profile.capabilities || [],
      metadata: profile.metadata,
      createdAt: new Date(),
      followers: [],
      following: [],
    };

    this.logger.info(`Social Agent initialized: ${this.profile.name} (${this.profile.id})`);
  }

  /**
   * Get agent profile
   */
  getProfile(): AgentProfile {
    return { ...this.profile };
  }

  /**
   * Update agent profile
   */
  async updateProfile(updates: Partial<AgentProfile>): Promise<void> {
    this.profile = {
      ...this.profile,
      ...updates,
      id: this.profile.id, // ID cannot be changed
      createdAt: this.profile.createdAt, // Creation time cannot be changed
    };

    await this.storage.saveAgent(this.profile);
    this.logger.info(`Profile updated: ${this.profile.name}`);
  }

  /**
   * Register a social skill
   */
  registerSkill(skill: SocialSkill): void {
    this.skillRegistry.register(skill);
    this.logger.debug(`Skill registered: ${skill.name} (${skill.actionType})`);
  }

  /**
   * Execute a social action
   */
  async execute(
    actionType: SocialActionType,
    params: any,
    context?: SocialContext
  ): Promise<SocialSkillResult> {
    const startTime = Date.now();

    try {
      // Get skill
      const skill = this.skillRegistry.get(actionType);
      if (!skill) {
        throw new Error(`No skill registered for action: ${actionType}`);
      }

      // Validate parameters
      if (skill.validate && !skill.validate(params)) {
        throw new Error('Parameter validation failed');
      }

      // Enrich context
      const enrichedContext: SocialContext = {
        agentId: this.profile.id,
        ...context,
      };

      // Execute skill
      this.logger.debug(`Executing ${actionType}: ${JSON.stringify(params)}`);
      const data = await skill.execute(params, enrichedContext);

      const result: SocialSkillResult = {
        success: true,
        data,
        actionType,
        timestamp: new Date(),
      };

      this.logger.info(`${actionType} executed successfully (${Date.now() - startTime}ms)`);
      return result;
    } catch (error: any) {
      this.logger.error(`${actionType} failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        actionType,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Post content
   */
  async post(
    content: string,
    options?: {
      media?: any[];
      mentions?: string[];
      tags?: string[];
      visibility?: 'public' | 'followers' | 'private';
      replyTo?: string;
    }
  ): Promise<SocialPost> {
    const post: SocialPost = {
      id: this.generateId(),
      authorId: this.profile.id,
      content,
      contentType: 'text',
      media: options?.media,
      mentions: options?.mentions,
      tags: options?.tags,
      visibility: options?.visibility || 'public',
      replyTo: options?.replyTo,
      createdAt: new Date(),
      likes: 0,
      shares: 0,
      replies: 0,
    };

    await this.storage.savePost(post);
    this.logger.info(`Post created: ${post.id}`);
    return post;
  }

  /**
   * Reply to a post
   */
  async reply(postId: string, content: string): Promise<SocialPost> {
    const originalPost = await this.storage.getPost(postId);
    if (!originalPost) {
      throw new Error('Post not found');
    }

    return await this.post(content, {
      replyTo: postId,
      mentions: [originalPost.authorId],
    });
  }

  /**
   * Like a post
   */
  async like(postId: string): Promise<void> {
    const post = await this.storage.getPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const interaction: SocialInteraction = {
      id: this.generateId(),
      type: 'like',
      actorId: this.profile.id,
      targetId: postId,
      targetType: 'post',
      timestamp: new Date(),
    };

    await this.storage.saveInteraction(interaction);
    this.logger.debug(`Liked post: ${postId}`);
  }

  /**
   * Share a post
   */
  async share(postId: string, comment?: string): Promise<SocialPost> {
    const originalPost = await this.storage.getPost(postId);
    if (!originalPost) {
      throw new Error('Post not found');
    }

    const sharePost: SocialPost = {
      id: this.generateId(),
      authorId: this.profile.id,
      content: comment || '',
      shareOf: postId,
      createdAt: new Date(),
      likes: 0,
      shares: 0,
      replies: 0,
    };

    await this.storage.savePost(sharePost);
    this.logger.info(`Shared post: ${postId}`);
    return sharePost;
  }

  /**
   * Follow another agent
   */
  async follow(agentId: string): Promise<void> {
    if (this.profile.following?.includes(agentId)) {
      this.logger.warn(`Already following: ${agentId}`);
      return;
    }

    this.profile.following = [...(this.profile.following || []), agentId];
    await this.storage.saveAgent(this.profile);

    const interaction: SocialInteraction = {
      id: this.generateId(),
      type: 'follow',
      actorId: this.profile.id,
      targetId: agentId,
      targetType: 'agent',
      timestamp: new Date(),
    };

    await this.storage.saveInteraction(interaction);
    this.logger.info(`Following: ${agentId}`);
  }

  /**
   * Unfollow an agent
   */
  async unfollow(agentId: string): Promise<void> {
    this.profile.following = (this.profile.following || []).filter((id) => id !== agentId);
    await this.storage.saveAgent(this.profile);

    const interaction: SocialInteraction = {
      id: this.generateId(),
      type: 'unfollow',
      actorId: this.profile.id,
      targetId: agentId,
      targetType: 'agent',
      timestamp: new Date(),
    };

    await this.storage.saveInteraction(interaction);
    this.logger.info(`Unfollowed: ${agentId}`);
  }

  /**
   * Get timeline feed
   */
  async getTimeline(limit: number = 20): Promise<SocialPost[]> {
    return await this.storage.getFeed(this.profile.id, 'timeline', limit);
  }

  /**
   * Get mentions
   */
  async getMentions(limit: number = 20): Promise<SocialPost[]> {
    return await this.storage.getFeed(this.profile.id, 'mentions', limit);
  }

  /**
   * Get agent's posts
   */
  async getPosts(limit: number = 20): Promise<SocialPost[]> {
    return await this.storage.getPosts(this.profile.id, limit);
  }

  /**
   * Get followers count
   */
  getFollowersCount(): number {
    return this.profile.followers?.length || 0;
  }

  /**
   * Get following count
   */
  getFollowingCount(): number {
    return this.profile.following?.length || 0;
  }

  /**
   * Search other agents
   */
  async searchAgents(query: string): Promise<AgentProfile[]> {
    return await this.storage.searchAgents(query);
  }

  /**
   * Set custom storage
   */
  setStorage(storage: ISocialStorage): void {
    this.storage = storage;
    this.logger.info('Custom storage configured');
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
