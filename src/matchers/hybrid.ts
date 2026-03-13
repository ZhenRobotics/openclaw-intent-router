/**
 * Hybrid Matcher - Combines keyword and semantic matching
 */

import { Intent, RegisteredSkill, MatchResult, IMatcher } from '../core/types';
import { AnalyzedIntent } from '../core/intent-analyzer';
import { KeywordMatcher } from './keyword';
import { SemanticMatcher } from './semantic';

export class HybridMatcher implements IMatcher {
  private keywordMatcher: KeywordMatcher;
  private semanticMatcher: SemanticMatcher;
  private keywordWeight: number = 0.7;
  private semanticWeight: number = 0.3;

  constructor(keywordWeight: number = 0.7, semanticWeight: number = 0.3) {
    this.keywordMatcher = new KeywordMatcher();
    this.semanticMatcher = new SemanticMatcher();
    this.keywordWeight = keywordWeight;
    this.semanticWeight = semanticWeight;
  }

  getName(): string {
    return 'hybrid';
  }

  /**
   * Match using both keyword and semantic strategies
   */
  async match(
    intent: AnalyzedIntent,
    skills: RegisteredSkill[]
  ): Promise<MatchResult[]> {
    // Get matches from both strategies
    const [keywordMatches, semanticMatches] = await Promise.all([
      this.keywordMatcher.match(intent, skills),
      this.semanticMatcher.match(intent, skills),
    ]);

    // Combine results
    const combinedMap = new Map<string, MatchResult>();

    // Add keyword matches
    for (const match of keywordMatches) {
      combinedMap.set(match.skill.id, {
        ...match,
        confidence: match.confidence * this.keywordWeight,
      });
    }

    // Merge semantic matches
    for (const match of semanticMatches) {
      const existing = combinedMap.get(match.skill.id);
      if (existing) {
        // Combine scores
        existing.confidence += match.confidence * this.semanticWeight;
        existing.reasoning = 'Hybrid match (keyword + semantic)';
      } else {
        combinedMap.set(match.skill.id, {
          ...match,
          confidence: match.confidence * this.semanticWeight,
          reasoning: 'Semantic match only',
        });
      }
    }

    // Convert to array and sort
    const results = Array.from(combinedMap.values());
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Set weights for combining strategies
   */
  setWeights(keywordWeight: number, semanticWeight: number): void {
    const total = keywordWeight + semanticWeight;
    this.keywordWeight = keywordWeight / total;
    this.semanticWeight = semanticWeight / total;
  }
}
