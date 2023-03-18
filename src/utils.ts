/** A utility function to load the logger. */
const logger = await import('winston')
  .then((winston) => {
    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
      ),
      transports: [new winston.transports.Console()],
    });
    logger.info('Logger loaded');
    return logger;
  })
  .catch((error) => {
    throw new Error('Failed to load logger: ' + error);
  });

export const loadLogger = logger;
