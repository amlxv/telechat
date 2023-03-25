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
  logger.info('Logger initialized.');
} catch (error) {
  console.error('Error when initializing logger.');
  process.exit(1);
}

export default logger;
