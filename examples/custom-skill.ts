/**
 * Example: Creating Custom Skills
 */

import { IntentRouter } from '../src/core/router';
import { BaseSkill } from '../src/skills/base';
import { ParameterSchema } from '../src/core/types';

/**
 * Custom skill: Email sender
 */
class EmailSenderSkill extends BaseSkill {
  name = 'email-sender';
  description = 'Send emails to recipients';
  triggers = ['send email', 'email to', 'compose email'];
  examples = [
    'Send an email to john@example.com',
    'Email the report to the team',
  ];
  tags = ['email', 'communication'];

  parameters: ParameterSchema = {
    recipient: {
      type: 'string',
      required: true,
      description: 'Email recipient',
    },
    subject: {
      type: 'string',
      required: true,
      description: 'Email subject',
    },
    body: {
      type: 'string',
      required: true,
      description: 'Email body',
    },
  };

  async execute(params: any): Promise<any> {
    // Validate parameters
    this.validate(params);

    // Simulate sending email
    console.log('Sending email...');
    console.log('To:', params.recipient);
    console.log('Subject:', params.subject);
    console.log('Body:', params.body);

    return {
      success: true,
      messageId: Math.random().toString(36).substr(2, 9),
      sentAt: new Date(),
    };
  }
}

/**
 * Custom skill: Database query
 */
class DatabaseQuerySkill extends BaseSkill {
  name = 'database-query';
  description = 'Query database for information';
  triggers = ['query database', 'search database', 'find in db'];

  parameters: ParameterSchema = {
    table: {
      type: 'string',
      required: true,
      description: 'Database table name',
    },
    conditions: {
      type: 'object',
      required: false,
      description: 'Query conditions',
    },
  };

  async execute(params: any): Promise<any> {
    console.log('Querying database...');
    console.log('Table:', params.table);
    console.log('Conditions:', params.conditions);

    // Simulate database query
    return {
      results: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      count: 2,
    };
  }
}

async function main() {
  const router = new IntentRouter({ logLevel: 'info' });

  // Register custom skills
  router.registerSkill(new EmailSenderSkill());
  router.registerSkill(new DatabaseQuerySkill());

  // Test email skill
  console.log('\n--- Testing Email Skill ---');
  const emailResult = await router.route('send email to john@example.com');
  console.log('Matched:', emailResult.primary.skill.name);
  console.log('Confidence:', emailResult.primary.confidence);

  // Test database skill
  console.log('\n--- Testing Database Skill ---');
  const dbResult = await router.route('query database for users');
  console.log('Matched:', dbResult.primary.skill.name);
  console.log('Confidence:', dbResult.primary.confidence);

  // Execute with custom parameters
  console.log('\n--- Executing Email Skill ---');
  const execution = await router.execute({
    ...emailResult,
    primary: {
      ...emailResult.primary,
      params: {
        recipient: 'john@example.com',
        subject: 'Test Email',
        body: 'Hello from Intent Router!',
      },
    },
  });
  console.log('Execution result:', execution);
}

main().catch(console.error);
