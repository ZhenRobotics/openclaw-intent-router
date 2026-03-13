/**
 * Semantic Matcher - Embedding-based semantic matching
 *
 * Note: This is a placeholder for semantic matching.
 * In production, you would integrate with an embedding model (OpenAI, Cohere, etc.)
 */

import { Intent, RegisteredSkill, MatchResult, IMatcher } from '../core/types';
import { AnalyzedIntent } from '../core/intent-analyzer';

export class SemanticMatcher implements IMatcher {
  getName(): string {
    return 'semantic';
  }

  /**
   * Match skills based on semantic similarity
   *
   * TODO: Integrate with actual embedding model
   */
  async match(
    intent: AnalyzedIntent,
    skills: RegisteredSkill[]
  ): Promise<MatchResult[]> {
    const results: MatchResult[] = [];

    for (const skill of skills) {
      const score = await this.calculateSemanticSimilarity(intent, skill);

      if (score > 0) {
        results.push({
          skill,
          confidence: score,
          params: {},
          reasoning: 'Semantic similarity match',
        });
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate semantic similarity
   *
   * This is a simplified implementation using word overlap.
   * In production, use proper embeddings.
   */
  private async calculateSemanticSimilarity(
    intent: AnalyzedIntent,
    skill: RegisteredSkill
  ): Promise<number> {
    // Simple fallback: use description + trigger overlap
    const skillText = [
      skill.description,
      ...skill.triggers,
      ...(skill.examples || []),
    ].join(' ').toLowerCase();

    const intentText = intent.normalized;

    // Count common words
    const intentWords = new Set(intentText.split(/\s+/));
    const skillWords = skillText.split(/\s+/);

    let matches = 0;
    for (const word of skillWords) {
      if (intentWords.has(word)) {
        matches++;
      }
    }

    // Normalize
    return Math.min(matches / Math.max(intentWords.size, skillWords.length), 1);
  }

  /**
   * TODO: Implement real embedding-based similarity
   *
   * Example integration with OpenAI embeddings:
   *
   * async getEmbedding(text: string): Promise<number[]> {
   *   const response = await openai.embeddings.create({
   *     model: "text-embedding-3-small",
   *     input: text,
   *   });
   *   return response.data[0].embedding;
   * }
   *
   * cosineSimilarity(a: number[], b: number[]): number {
   *   let dotProduct = 0;
   *   let normA = 0;
   *   let normB = 0;
   *   for (let i = 0; i < a.length; i++) {
   *     dotProduct += a[i] * b[i];
   *     normA += a[i] * a[i];
   *     normB += b[i] * b[i];
   *   }
   *   return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
   * }
   */
}
