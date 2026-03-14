/**
 * Decentral Social - Core Type Definitions
 * Social should be a skill, not a site.
 */

/**
 * Social Agent Profile
 */
export interface AgentProfile {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  capabilities: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  followers?: string[];
  following?: string[];
}

/**
 * Social Action Types
 */
export type SocialActionType =
  | 'post'
  | 'reply'
  | 'like'
  | 'share'
  | 'follow'
  | 'unfollow'
  | 'mention'
  | 'dm';

/**
 * Social Post
 */
export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  contentType?: 'text' | 'markdown' | 'html';
  media?: MediaAttachment[];
  mentions?: string[];
  tags?: string[];
  visibility?: 'public' | 'followers' | 'private';
  replyTo?: string;
  shareOf?: string;
  createdAt: Date;
  updatedAt?: Date;
  likes?: number;
  shares?: number;
  replies?: number;
}

/**
 * Media Attachment
 */
export interface MediaAttachment {
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Social Interaction
 */
export interface SocialInteraction {
  id: string;
  type: SocialActionType;
  actorId: string;
  targetId: string;
  targetType: 'agent' | 'post';
  content?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Social Skill Definition
 */
export interface SocialSkill {
  name: string;
  description: string;
  actionType: SocialActionType;
  execute: (params: any, context?: SocialContext) => Promise<any>;
  validate?: (params: any) => boolean;
  permissions?: string[];
}

/**
 * Social Context
 */
export interface SocialContext {
  agentId: string;
  conversationId?: string;
  threadId?: string;
  community?: string;
  visibility?: 'public' | 'followers' | 'private';
  metadata?: Record<string, any>;
}

/**
 * Social Feed
 */
export interface SocialFeed {
  type: 'timeline' | 'mentions' | 'notifications' | 'community';
  posts: SocialPost[];
  cursor?: string;
  hasMore: boolean;
}

/**
 * Social Network Configuration
 */
export interface SocialNetworkConfig {
  federationEnabled?: boolean;
  protocol?: 'activitypub' | 'custom';
  maxPostLength?: number;
  allowedMediaTypes?: string[];
  rateLimit?: {
    posts?: number;
    follows?: number;
    period?: number;
  };
  storage?: 'memory' | 'file' | 'database';
  logLevel?: LogLevel;
}

/**
 * Federation Protocol
 */
export interface FederationProtocol {
  name: string;
  send: (activity: any, targetNode: string) => Promise<void>;
  receive: (activity: any) => Promise<void>;
  discover: (agentId: string) => Promise<AgentProfile | null>;
}

/**
 * Activity (for ActivityPub-like protocols)
 */
export interface Activity {
  '@context'?: string[];
  type: string;
  actor: string;
  object: any;
  target?: string;
  published?: Date;
  to?: string[];
  cc?: string[];
}

/**
 * Social Analytics
 */
export interface SocialAnalytics {
  agentId: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  totalLikes: number;
  totalShares: number;
  engagement?: number;
  topPosts?: SocialPost[];
  period?: {
    start: Date;
    end: Date;
  };
}

/**
 * Social Storage Interface
 */
export interface ISocialStorage {
  // Agents
  saveAgent(agent: AgentProfile): Promise<void>;
  getAgent(agentId: string): Promise<AgentProfile | null>;
  searchAgents(query: string): Promise<AgentProfile[]>;

  // Posts
  savePost(post: SocialPost): Promise<void>;
  getPost(postId: string): Promise<SocialPost | null>;
  getPosts(agentId: string, limit?: number): Promise<SocialPost[]>;
  deletPost(postId: string): Promise<void>;

  // Interactions
  saveInteraction(interaction: SocialInteraction): Promise<void>;
  getInteractions(agentId: string, type?: SocialActionType): Promise<SocialInteraction[]>;

  // Feed
  getFeed(agentId: string, type: 'timeline' | 'mentions', limit?: number): Promise<SocialPost[]>;
}

/**
 * Social Skill Registry Interface
 */
export interface ISocialSkillRegistry {
  register(skill: SocialSkill): void;
  get(actionType: SocialActionType): SocialSkill | undefined;
  getAll(): SocialSkill[];
  has(actionType: SocialActionType): boolean;
}

/**
 * Log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

/**
 * Social Skill Result
 */
export interface SocialSkillResult {
  success: boolean;
  data?: any;
  error?: string;
  actionType: SocialActionType;
  timestamp: Date;
}
