/**
 * Base Skill Class - Template for creating skills
 */

import { SkillDefinition, ParameterSchema } from '../core/types';

export abstract class BaseSkill implements SkillDefinition {
  abstract name: string;
  abstract description: string;
  abstract triggers: string[];

  parameters?: ParameterSchema;
  examples?: string[];
  tags?: string[];
  enabled: boolean = true;

  /**
   * Execute the skill with given parameters
   */
  abstract execute(params: any, context?: any): Promise<any>;

  /**
   * Validate parameters before execution
   */
  validate(params: any): boolean {
    if (!this.parameters) return true;

    for (const [key, schema] of Object.entries(this.parameters)) {
      // Check required parameters
      if (schema.required && !(key in params)) {
        throw new Error(`Missing required parameter: ${key}`);
      }

      // Check parameter type
      if (key in params) {
        const actualType = Array.isArray(params[key])
          ? 'array'
          : typeof params[key];

        if (actualType !== schema.type) {
          throw new Error(
            `Invalid type for ${key}: expected ${schema.type}, got ${actualType}`
          );
        }

        // Check enum values
        if (schema.enum && !schema.enum.includes(params[key])) {
          throw new Error(
            `Invalid value for ${key}: must be one of ${schema.enum.join(', ')}`
          );
        }
      }
    }

    return true;
  }

  /**
   * Get skill metadata
   */
  getMetadata() {
    return {
      name: this.name,
      description: this.description,
      triggers: this.triggers,
      parameters: this.parameters,
      examples: this.examples,
      tags: this.tags,
    };
  }
}
