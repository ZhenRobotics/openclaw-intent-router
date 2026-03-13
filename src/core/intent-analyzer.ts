/**
 * Intent Analyzer - Analyzes and enriches user intents
 */

import { Intent } from './types';

export interface AnalyzedIntent extends Intent {
  tokens: string[];
  entities: Record<string, any>;
  normalized: string;
}

export class IntentAnalyzer {
  /**
   * Analyze an intent and extract useful information
   */
  async analyze(intent: Intent): Promise<AnalyzedIntent> {
    const text = intent.text.trim();

    return {
      ...intent,
      tokens: this.tokenize(text),
      entities: this.extractEntities(text),
      normalized: this.normalize(text),
    };
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 0);
  }

  /**
   * Extract entities from text (basic implementation)
   */
  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract numbers
    const numbers = text.match(/\b\d+(\.\d+)?\b/g);
    if (numbers) {
      entities.numbers = numbers.map(Number);
    }

    // Extract URLs
    const urls = text.match(/https?:\/\/[^\s]+/g);
    if (urls) {
      entities.urls = urls;
    }

    // Extract emails
    const emails = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
    if (emails) {
      entities.emails = emails;
    }

    // Extract quoted strings
    const quotes = text.match(/"([^"]*)"/g);
    if (quotes) {
      entities.quotes = quotes.map((q) => q.slice(1, -1));
    }

    return entities;
  }

  /**
   * Normalize text for better matching
   */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
