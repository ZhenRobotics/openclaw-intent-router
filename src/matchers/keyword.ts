/**
 * Keyword Matcher - Simple keyword-based matching
 */

import { Intent, RegisteredSkill, MatchResult, IMatcher } from '../core/types';
import { AnalyzedIntent } from '../core/intent-analyzer';

export class KeywordMatcher implements IMatcher {
  getName(): string {
    return 'keyword';
  }

  /**
   * Match skills based on keyword overlap
   */
  async match(
    intent: AnalyzedIntent,
    skills: RegisteredSkill[]
  ): Promise<MatchResult[]> {
    const results: MatchResult[] = [];

    for (const skill of skills) {
      const score = this.calculateScore(intent, skill);

      if (score > 0) {
        results.push({
          skill,
          confidence: score,
          params: this.extractParams(intent, skill),
          matchedTriggers: this.getMatchedTriggers(intent, skill),
        });
      }
    }

    // Sort by confidence (descending)
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate matching score based on keyword overlap
   * Uses best matching trigger (not sum of all triggers)
   */
  private calculateScore(
    intent: AnalyzedIntent,
    skill: RegisteredSkill
  ): number {
    const intentTokens = new Set(intent.tokens);
    let bestScore = 0;

    // Find the best matching trigger
    for (const trigger of skill.triggers) {
      const triggerTokens = trigger.toLowerCase().split(/\s+/);
      let matchCount = 0;

      // Count token matches
      for (const token of triggerTokens) {
        if (intentTokens.has(token)) {
          matchCount++;
        }
      }

      // Calculate score for this trigger
      let score = 0;
      if (matchCount > 0) {
        // Base score: percentage of trigger tokens matched
        score = matchCount / triggerTokens.length;

        // Bonus for exact phrase match in intent
        if (intent.normalized.includes(trigger.toLowerCase())) {
          score = Math.min(score + 0.3, 1.0);
        }

        // Bonus for complete trigger match
        if (matchCount === triggerTokens.length) {
          score = Math.min(score + 0.2, 1.0);
        }
      }

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  /**
   * Extract parameters from intent
   */
  private extractParams(
    intent: AnalyzedIntent,
    skill: RegisteredSkill
  ): Record<string, any> {
    const params: Record<string, any> = {};

    if (!skill.parameters) return params;

    // Use extracted entities
    if (intent.entities) {
      for (const [key, value] of Object.entries(intent.entities)) {
        if (key in skill.parameters) {
          params[key] = value;
        }
      }
    }

    // Set default values
    for (const [key, schema] of Object.entries(skill.parameters)) {
      if (!(key in params) && schema.default !== undefined) {
        params[key] = schema.default;
      }
    }

    return params;
  }

  /**
   * Get matched triggers
   */
  private getMatchedTriggers(
    intent: AnalyzedIntent,
    skill: RegisteredSkill
  ): string[] {
    return skill.triggers.filter((trigger) =>
      intent.normalized.includes(trigger.toLowerCase())
    );
  }
}
