import {
  Logger,
  LoggerOptions,
  createLogger,
  format,
  transports,
} from 'winston';

let logger: Logger;

const options: LoggerOptions = {
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [new transports.Console()],
};

try {
  logger = createLogger(options);
  logger.info('Logger loaded');
} catch (error) {
  throw new Error('Failed to load logger: ' + error);
}

export default logger;
