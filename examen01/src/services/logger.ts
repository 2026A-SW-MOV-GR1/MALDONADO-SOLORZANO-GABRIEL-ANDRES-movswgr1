/**
 * Servicio de logging centralizado
 */

class ConsoleLogger {
  private prefix = '[DualPersistence]';
  private enableDebug = true;

  debug(message: string, data?: any): void {
    if (this.enableDebug) {
      console.debug(`${this.prefix} [DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any): void {
    console.info(`${this.prefix} [INFO] ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`${this.prefix} [WARN] ${message}`, data || '');
  }

  error(message: string, error?: any): void {
    console.error(`${this.prefix} [ERROR] ${message}`, error || '');
  }

  setDebugEnabled(enabled: boolean): void {
    this.enableDebug = enabled;
  }
}

export const logger = new ConsoleLogger();
