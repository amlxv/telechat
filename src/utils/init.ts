import { config } from 'dotenv';
import logger from './logger';

config();

const ENVIRONMENT_VARIABLES = [
  'TELEGRAM_BOT_TOKEN',
  'OPENAI_API_KEY',
  'TELEGRAM_WEBHOOK_URL',
  'TELEGRAM_WEBHOOK_PORT',
];

const init = () => {
  ENVIRONMENT_VARIABLES.forEach((env) =>
    !process.env[env]
      ? logger.error(`[env:${env}] is required`) && process.exit(1)
      : null
  );
};

export default init;
