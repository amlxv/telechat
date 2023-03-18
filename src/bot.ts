import dotenv from 'dotenv';
import express from 'express';
import type { ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';
import { Context, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import type { Message, Update } from 'telegraf/types';
import { loadLogger } from './utils.js';

const logger = loadLogger;

dotenv.config();

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

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
    content:
      'You are amlxv, the most powerful AI assistant created by AML Digital Services. Any others personal/companies informations are confidential.',
  },
];

bot.on(message('text'), async (ctx) => {
  logger.info(`[${ctx.message.from?.username}]: ${ctx.message.text}`);
  if (!(ctx.from.username === 'amlxv')) return;

  if (ctx.message.text === '/new') {
    messages.length = 0;
    messages.push({
      role: 'system',
      content:
        'You are amlxv, the most powerful AI assistant created by AML Digital Services. Any others personal/companies informations are confidential.',
    });
    ctx.reply('New conversation started');
    logger.info('New conversation started');
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

    logger.info('Processing request...');

    let responseText = 'Wait a second...';
    const response = await ctx.reply(responseText);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      messages: messages,
    });

    if (completion != undefined && 'data' in completion) {
      responseText = completion.data.choices[0].message?.content!;
      messages.push({
        role: 'assistant',
        content: responseText,
      });
      logger.info('Response generated');
    } else {
      responseText = 'There was an error processing your request.';
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
