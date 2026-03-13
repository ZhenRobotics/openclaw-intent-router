/**
 * Intent Router - Core Type Definitions
 */

/**
 * User intent representation
 */
export interface Intent {
  text: string;
  context?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  timestamp?: Date;
  sessionId?: string;
}

/**
 * Skill parameter schema
 */
export interface ParameterSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    default?: any;
    description?: string;
    enum?: any[];
  };
}

/**
 * Skill definition
 */
export interface SkillDefinition {
  name: string;
  description: string;
  triggers: string[];
  parameters?: ParameterSchema;
  examples?: string[];
  tags?: string[];
  enabled?: boolean;
  execute: (params: any, context?: any) => Promise<any>;
  validate?: (params: any) => boolean;
}

/**
 * Registered skill with metadata
 */
export interface RegisteredSkill extends SkillDefinition {
  id: string;
  registeredAt: Date;
  executionCount: number;
  averageConfidence: number;
}

/**
 * Match result from skill matcher
 */
export interface MatchResult {
  skill: RegisteredSkill;
  confidence: number;
  params: Record<string, any>;
  matchedTriggers?: string[];
  reasoning?: string;
}

/**
 * Route result with alternatives
 */
export interface RouteResult {
  primary: MatchResult;
  alternatives: MatchResult[];
  intent: Intent;
  processingTime: number;
}

/**
 * Execution result
 */
export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  skill: string;
  executionTime: number;
  timestamp: Date;
}

/**
 * Router configuration
 */
export interface RouterConfig {
  matchingStrategy?: 'keyword' | 'semantic' | 'hybrid';
  confidenceThreshold?: number;
  maxAlternatives?: number;
  enableContextTracking?: boolean;
  enableAnalytics?: boolean;
  logLevel?: LogLevel;
  fallbackSkill?: string;
}

/**
 * Fallback configuration
 */
export interface FallbackConfig {
  threshold: number;
  handler: (intent: Intent) => Promise<any>;
}

/**
 * Matching strategy interface
 */
export interface IMatcher {
  match(intent: Intent, skills: RegisteredSkill[]): Promise<MatchResult[]>;
  getName(): string;
}

/**
 * Context tracking
 */
export interface ConversationContext {
  sessionId: string;
  history: Intent[];
  variables: Record<string, any>;
  lastSkill?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  type: 'route' | 'execute' | 'error' | 'fallback';
  timestamp: Date;
  intent?: string;
  skill?: string;
  confidence?: number;
  executionTime?: number;
  error?: string;
}

/**
 * Hook types
 */
export type HookType =
  | 'before-route'
  | 'after-route'
  | 'before-execute'
  | 'after-execute'
  | 'on-error'
  | 'on-fallback';

export type HookHandler = (data: any) => void | Promise<void>;

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
 * Skill registry interface
 */
export interface ISkillRegistry {
  register(skill: SkillDefinition): RegisteredSkill;
  unregister(skillId: string): boolean;
  get(skillId: string): RegisteredSkill | undefined;
  getAll(): RegisteredSkill[];
  getByName(name: string): RegisteredSkill | undefined;
  search(query: string): RegisteredSkill[];
}
