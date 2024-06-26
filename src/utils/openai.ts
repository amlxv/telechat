import type { ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';
import {
  OPENAI_API_DEFAULT_MODEL,
  OPENAI_API_DEFAULT_STREAM,
  OPENAI_API_DEFAULT_TEMPERATURE,
} from './constants';
import logger from './logger';

export class OpenAI {
  #apiKey: string;
  #client: OpenAIApi;

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
    this.#client = this.#getClient();
    this.#verifyAPIKey()
      .then(() => {
        logger.info("OpenAI's API key is valid");
        logger.info('The bot is ready to use!');
      })
      .catch((error) => {
        logger.error(error?.response?.data?.error?.message ?? error);
        process.exit(1);
      });
  }

  #getClient() {
    const configuration = new Configuration({
      apiKey: this.#apiKey,
    });
    return new OpenAIApi(configuration);
  }

  #verifyAPIKey = () => {
    return this.createChatCompletion([
      {
        role: 'user',
        content: 'Hi',
      },
    ]);
  };

  createChatCompletion = async (messages: ChatCompletionRequestMessage[]) => {
    const model = OPENAI_API_DEFAULT_MODEL;
    const temperature = OPENAI_API_DEFAULT_TEMPERATURE;
    const stream = OPENAI_API_DEFAULT_STREAM;

    return await this.#client.createChatCompletion({
      model,
      temperature,
      messages,
      stream,
    });
  };
}
