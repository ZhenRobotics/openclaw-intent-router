/**
 * Skill Registry - Manages registered skills
 */

import {
  SkillDefinition,
  RegisteredSkill,
  ISkillRegistry,
  ILogger,
} from '../core/types';
import { randomUUID } from 'crypto';

export class SkillRegistry implements ISkillRegistry {
  private skills: Map<string, RegisteredSkill> = new Map();
  private nameIndex: Map<string, string> = new Map();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Register a new skill
   */
  register(skill: SkillDefinition): RegisteredSkill {
    // Check if skill with same name already exists
    if (this.nameIndex.has(skill.name)) {
      const existingId = this.nameIndex.get(skill.name)!;
      this.logger.warn(
        `Skill "${skill.name}" already registered. Replacing existing skill.`
      );
      this.skills.delete(existingId);
    }

    const registered: RegisteredSkill = {
      ...skill,
      id: randomUUID(),
      registeredAt: new Date(),
      executionCount: 0,
      averageConfidence: 0,
      enabled: skill.enabled !== false,
    };

    this.skills.set(registered.id, registered);
    this.nameIndex.set(registered.name, registered.id);

    this.logger.debug(`Skill registered: ${skill.name} (${registered.id})`);
    return registered;
  }

  /**
   * Unregister a skill
   */
  unregister(skillId: string): boolean {
    const skill = this.skills.get(skillId);
    if (!skill) {
      this.logger.warn(`Skill not found: ${skillId}`);
      return false;
    }

    this.skills.delete(skillId);
    this.nameIndex.delete(skill.name);
    this.logger.info(`Skill unregistered: ${skill.name}`);
    return true;
  }

  /**
   * Get skill by ID
   */
  get(skillId: string): RegisteredSkill | undefined {
    return this.skills.get(skillId);
  }

  /**
   * Get all skills
   */
  getAll(): RegisteredSkill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get skill by name
   */
  getByName(name: string): RegisteredSkill | undefined {
    const id = this.nameIndex.get(name);
    return id ? this.skills.get(id) : undefined;
  }

  /**
   * Search skills by query
   */
  search(query: string): RegisteredSkill[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      (skill) =>
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery) ||
        skill.triggers.some((trigger) =>
          trigger.toLowerCase().includes(lowerQuery)
        ) ||
        skill.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Update skill execution statistics
   */
  updateStats(skillId: string, confidence: number): void {
    const skill = this.skills.get(skillId);
    if (!skill) return;

    skill.executionCount += 1;
    skill.averageConfidence =
      (skill.averageConfidence * (skill.executionCount - 1) + confidence) /
      skill.executionCount;

    this.logger.debug(
      `Updated stats for ${skill.name}: ${skill.executionCount} executions, avg confidence: ${skill.averageConfidence.toFixed(2)}`
    );
  }

  /**
   * Clear all skills
   */
  clear(): void {
    this.skills.clear();
    this.nameIndex.clear();
    this.logger.info('All skills cleared');
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const skills = this.getAll();
    return {
      totalSkills: skills.length,
      enabledSkills: skills.filter((s) => s.enabled).length,
      totalExecutions: skills.reduce((sum, s) => sum + s.executionCount, 0),
      mostUsedSkill: skills.reduce(
        (max, s) => (s.executionCount > max.executionCount ? s : max),
        skills[0]
      ),
    };
  }
}
