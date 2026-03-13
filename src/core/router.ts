/**
 * Intent Router - Main Routing Engine
 */

import {
  Intent,
  RouteResult,
  ExecutionResult,
  RouterConfig,
  FallbackConfig,
  HookType,
  HookHandler,
  SkillDefinition,
  RegisteredSkill,
  MatchResult,
  IMatcher,
  ILogger,
} from './types';
import { SkillRegistry } from '../skills/registry';
import { IntentAnalyzer } from './intent-analyzer';
import { HybridMatcher } from '../matchers/hybrid';
import { ConsoleLogger } from '../utils/logger';

export class IntentRouter {
  private registry: SkillRegistry;
  private analyzer: IntentAnalyzer;
  private matcher: IMatcher;
  private config: RouterConfig;
  private logger: ILogger;
  private hooks: Map<HookType, HookHandler[]> = new Map();
  private fallback?: FallbackConfig;

  constructor(config: RouterConfig = {}) {
    this.config = {
      matchingStrategy: 'hybrid',
      confidenceThreshold: 0.6,
      maxAlternatives: 3,
      enableContextTracking: false,
      enableAnalytics: false,
      logLevel: 'info',
      ...config,
    };

    this.logger = new ConsoleLogger(this.config.logLevel || 'info');
    this.registry = new SkillRegistry(this.logger);
    this.analyzer = new IntentAnalyzer();
    this.matcher = new HybridMatcher();

    this.logger.info('Intent Router initialized');
  }

  /**
   * Register a new skill
   */
  registerSkill(skill: SkillDefinition): RegisteredSkill {
    this.logger.debug(`Registering skill: ${skill.name}`);
    const registered = this.registry.register(skill);
    this.logger.info(`Skill registered: ${skill.name} (${registered.id})`);
    return registered;
  }

  /**
   * Unregister a skill
   */
  unregisterSkill(skillId: string): boolean {
    this.logger.debug(`Unregistering skill: ${skillId}`);
    return this.registry.unregister(skillId);
  }

  /**
   * Get all registered skills
   */
  getSkills(): RegisteredSkill[] {
    return this.registry.getAll();
  }

  /**
   * Get skill by name
   */
  getSkill(name: string): RegisteredSkill | undefined {
    return this.registry.getByName(name);
  }

  /**
   * Route an intent to the best matching skill
   */
  async route(intentInput: string | Intent): Promise<RouteResult> {
    const startTime = Date.now();

    // Normalize intent
    const intent: Intent =
      typeof intentInput === 'string'
        ? { text: intentInput, timestamp: new Date() }
        : intentInput;

    this.logger.debug(`Routing intent: "${intent.text}"`);
    await this.runHooks('before-route', { intent });

    try {
      // Analyze intent
      const analyzed = await this.analyzer.analyze(intent);
      this.logger.debug('Intent analyzed', analyzed);

      // Get all available skills
      const skills = this.registry.getAll().filter((s) => s.enabled !== false);

      if (skills.length === 0) {
        throw new Error('No skills registered');
      }

      // Match skills
      const matches = await this.matcher.match(analyzed, skills);
      this.logger.debug(`Found ${matches.length} matches`);

      // Filter by confidence threshold
      const validMatches = matches.filter(
        (m) => m.confidence >= (this.config.confidenceThreshold || 0.6)
      );

      if (validMatches.length === 0) {
        return await this.handleFallback(intent, startTime);
      }

      // Build result
      const result: RouteResult = {
        primary: validMatches[0],
        alternatives: validMatches
          .slice(1, (this.config.maxAlternatives || 3) + 1),
        intent,
        processingTime: Date.now() - startTime,
      };

      await this.runHooks('after-route', { result });
      this.logger.info(
        `Routed to skill: ${result.primary.skill.name} (confidence: ${result.primary.confidence.toFixed(2)})`
      );

      return result;
    } catch (error: any) {
      this.logger.error('Routing error:', error.message);
      await this.runHooks('on-error', { intent, error });
      throw error;
    }
  }

  /**
   * Execute a routed skill
   */
  async execute(routeResult: RouteResult): Promise<ExecutionResult> {
    const startTime = Date.now();
    const { primary, intent } = routeResult;

    this.logger.debug(`Executing skill: ${primary.skill.name}`);
    await this.runHooks('before-execute', { routeResult });

    try {
      // Validate parameters if validator exists
      if (primary.skill.validate && !primary.skill.validate(primary.params)) {
        throw new Error('Parameter validation failed');
      }

      // Execute skill
      const data = await primary.skill.execute(primary.params, intent.context);

      // Update execution stats
      this.registry.updateStats(primary.skill.id, primary.confidence);

      const result: ExecutionResult = {
        success: true,
        data,
        skill: primary.skill.name,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      };

      await this.runHooks('after-execute', { result });
      this.logger.info(
        `Skill executed: ${primary.skill.name} (${result.executionTime}ms)`
      );

      return result;
    } catch (error: any) {
      this.logger.error(`Execution error in ${primary.skill.name}:`, error.message);

      const result: ExecutionResult = {
        success: false,
        error: error.message,
        skill: primary.skill.name,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      };

      await this.runHooks('on-error', { result, error });
      return result;
    }
  }

  /**
   * Route and execute in one call
   */
  async process(intentInput: string | Intent): Promise<ExecutionResult> {
    const routeResult = await this.route(intentInput);
    return await this.execute(routeResult);
  }

  /**
   * Set custom matcher
   */
  setMatcher(matcher: IMatcher): void {
    this.logger.info(`Switching matcher to: ${matcher.getName()}`);
    this.matcher = matcher;
  }

  /**
   * Set fallback handler
   */
  setFallback(config: FallbackConfig): void {
    this.fallback = config;
    this.logger.info('Fallback handler configured');
  }

  /**
   * Register hook
   */
  use(hookType: HookType, handler: HookHandler): void {
    if (!this.hooks.has(hookType)) {
      this.hooks.set(hookType, []);
    }
    this.hooks.get(hookType)!.push(handler);
    this.logger.debug(`Hook registered: ${hookType}`);
  }

  /**
   * Handle fallback when no match found
   */
  private async handleFallback(
    intent: Intent,
    startTime: number
  ): Promise<RouteResult> {
    this.logger.warn(`No matching skills for: "${intent.text}"`);
    await this.runHooks('on-fallback', { intent });

    if (this.fallback) {
      // Use custom fallback
      throw new Error(
        `No skills matched with confidence >= ${this.config.confidenceThreshold}`
      );
    } else {
      // Default fallback
      throw new Error(
        `No matching skills found for intent: "${intent.text}"`
      );
    }
  }

  /**
   * Run hooks for a specific type
   */
  private async runHooks(hookType: HookType, data: any): Promise<void> {
    const handlers = this.hooks.get(hookType);
    if (!handlers || handlers.length === 0) return;

    for (const handler of handlers) {
      try {
        await handler(data);
      } catch (error: any) {
        this.logger.error(`Hook error (${hookType}):`, error.message);
      }
    }
  }

  /**
   * Get router statistics
   */
  getStats() {
    const skills = this.registry.getAll();
    return {
      totalSkills: skills.length,
      enabledSkills: skills.filter((s) => s.enabled !== false).length,
      totalExecutions: skills.reduce((sum, s) => sum + s.executionCount, 0),
      averageConfidence:
        skills.reduce((sum, s) => sum + s.averageConfidence, 0) /
        skills.length,
    };
  }
}
