/**
 * Decentral Social - Social Skill Registry
 */

import { SocialSkill, SocialActionType, ISocialSkillRegistry } from '../core/types';

export class SocialSkillRegistry implements ISocialSkillRegistry {
  private skills: Map<SocialActionType, SocialSkill> = new Map();

  /**
   * Register a social skill
   */
  register(skill: SocialSkill): void {
    if (this.skills.has(skill.actionType)) {
      throw new Error(`Skill already registered for action: ${skill.actionType}`);
    }
    this.skills.set(skill.actionType, skill);
  }

  /**
   * Get skill by action type
   */
  get(actionType: SocialActionType): SocialSkill | undefined {
    return this.skills.get(actionType);
  }

  /**
   * Get all registered skills
   */
  getAll(): SocialSkill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Check if skill exists
   */
  has(actionType: SocialActionType): boolean {
    return this.skills.has(actionType);
  }

  /**
   * Unregister a skill
   */
  unregister(actionType: SocialActionType): boolean {
    return this.skills.delete(actionType);
  }

  /**
   * Clear all skills
   */
  clear(): void {
    this.skills.clear();
  }

  /**
   * Get count of registered skills
   */
  count(): number {
    return this.skills.size;
  }
}
