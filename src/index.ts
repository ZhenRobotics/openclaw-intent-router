/**
 * Decentral Social - Main Entry Point
 * Social should be a skill, not a site.
 */

// Core
export { SocialAgent } from './core/social-agent';

// Skills
export { SocialSkillRegistry } from './skills/registry';

// Storage
export { MemoryStorage } from './storage/memory';

// Types
export type {
  AgentProfile,
  SocialActionType,
  SocialPost,
  SocialInteraction,
  SocialSkill,
  SocialContext,
  SocialFeed,
  SocialNetworkConfig,
  SocialAnalytics,
  SocialSkillResult,
  MediaAttachment,
  Activity,
  FederationProtocol,
  ISocialStorage,
  ISocialSkillRegistry,
  ILogger,
  LogLevel,
} from './core/types';

// Utils
export { ConsoleLogger } from './utils/logger';
