import express from 'express';
import type { ChatCompletionRequestMessage } from 'openai';
import { Context, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import type { Message, Update } from 'telegraf/types';
import {
  ERROR_PROCESSING_REQUEST_MESSAGE,
  OPENAI_API_DEFAULT_SYSTEM_MESSAGE,
  PROCESSING_REQUEST_MESSAGE,
  RESPONSE_GENERATED_MESSAGE,
  START_NEW_CONVERSATION_MESSAGE,
  TELEGRAM_INITIAL_RESPONSE_MESSAGE,
} from './utils/constants';
import { init } from './utils/init';
import logger from './utils/logger';
import { OpenAI } from './utils/openai';

init();

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const { createChatCompletion } = new OpenAI(process.env.OPENAI_API_KEY!);

bot
  .createWebhook({ domain: process.env.TELEGRAM_WEBHOOK_URL! })
  .then((webhook) => {
    app.use(webhook);
    logger.info('Webhook created');
  })
  .catch((error) => {
    logger.error(error);
  });

const messages: ChatCompletionRequestMessage[] = [
  {
    role: 'system',
    content: OPENAI_API_DEFAULT_SYSTEM_MESSAGE,
  },
];

bot.on(message('text'), async (ctx) => {
  logger.info(`[${ctx.message.from?.username}]: ${ctx.message.text}`);
  if (!(ctx.from.username === 'amlxv')) return;

  if (ctx.message.text === '/new') {
    messages.length = 0;
    messages.push({
      role: 'system',
      content: OPENAI_API_DEFAULT_SYSTEM_MESSAGE,
    });
    ctx.reply(START_NEW_CONVERSATION_MESSAGE);
    logger.info(START_NEW_CONVERSATION_MESSAGE);
    return;
  }
  await handleRequest(ctx);
});

const handleRequest = async (
  ctx: Context<Update.MessageUpdate<Message.TextMessage>>
) => {
  try {
    messages.push({
      role: 'user',
      content: ctx.message.text,
    });
    logger.info(PROCESSING_REQUEST_MESSAGE);

    let responseText = TELEGRAM_INITIAL_RESPONSE_MESSAGE;
    const response = await ctx.reply(responseText);

    const completion = await createChatCompletion(messages);

    if (completion != undefined && 'data' in completion) {
      responseText = completion.data.choices[0].message?.content!;
      messages.push({
        role: 'assistant',
        content: responseText,
      });
      logger.info(RESPONSE_GENERATED_MESSAGE);
    } else {
      responseText = ERROR_PROCESSING_REQUEST_MESSAGE;
    }

    ctx.telegram.editMessageText(
      ctx.chat.id,
      response.message_id,
      undefined,
      responseText
    );

    logger.info(`Response sent to ${ctx.message.from?.username}`);
  } catch (error: any) {
    logger.error(error);
  }
};

app.listen(process.env.TELEGRAM_WEBHOOK_PORT, () => {
  logger.info(`Bot ready on port: ${process.env.TELEGRAM_WEBHOOK_PORT}!`);
});
