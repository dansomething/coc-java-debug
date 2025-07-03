/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
export interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
}

class ConsoleLogger implements Logger {
  debug(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): void {
    console.info(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, ...optionalParams);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable no-console */

const logger = new ConsoleLogger();

export function getLogger(): Logger {
  return logger;
}
