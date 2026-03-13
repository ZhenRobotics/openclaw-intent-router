/**
 * Intent Router - Main Entry Point
 */

export { IntentRouter } from './core/router';
export { IntentAnalyzer } from './core/intent-analyzer';
export { SkillRegistry } from './skills/registry';
export { BaseSkill } from './skills/base';

// Matchers
export { KeywordMatcher } from './matchers/keyword';
export { SemanticMatcher } from './matchers/semantic';
export { HybridMatcher } from './matchers/hybrid';

// Types
export type {
  Intent,
  SkillDefinition,
  RegisteredSkill,
  MatchResult,
  RouteResult,
  ExecutionResult,
  RouterConfig,
  FallbackConfig,
  ParameterSchema,
  IMatcher,
  ILogger,
  ISkillRegistry,
  HookType,
  HookHandler,
  LogLevel,
} from './core/types';

// Utils
export { ConsoleLogger } from './utils/logger';
