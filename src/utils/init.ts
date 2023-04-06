import { config } from 'dotenv';
import logger from './logger';

export const init: () => void = (): void => {
  /** Load the .env file */
  config();

  /** List of required env */
  const ENVIRONMENT_VARIABLES: string[] = [
    'TELEGRAM_BOT_TOKEN',
    'OPENAI_API_KEY',
    'TELEGRAM_WEBHOOK_URL',
    'TELEGRAM_WEBHOOK_PORT',
  ];

  /** Check the existence **/
  ENVIRONMENT_VARIABLES.forEach((env: string): null =>
    !process.env[env]
      ? logger.error(`[env:${env}] is required`) && process.exit(1)
      : null
  );
};
