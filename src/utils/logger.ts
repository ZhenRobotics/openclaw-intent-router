/**
 * Decentral Social - Logger Implementation
 */

import { ILogger, LogLevel } from '../core/types';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

const COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',
};

export class ConsoleLogger implements ILogger {
  private level: LogLevel;
  private levelValue: number;

  constructor(level: LogLevel = 'info') {
    this.level = level;
    this.levelValue = LOG_LEVELS[level];
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(
        `${COLORS.debug}[DEBUG]${COLORS.reset} ${message}`,
        ...args
      );
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(
        `${COLORS.info}[INFO]${COLORS.reset} ${message}`,
        ...args
      );
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(
        `${COLORS.warn}[WARN]${COLORS.reset} ${message}`,
        ...args
      );
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(
        `${COLORS.error}[ERROR]${COLORS.reset} ${message}`,
        ...args
      );
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= this.levelValue;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
    this.levelValue = LOG_LEVELS[level];
  }
}
