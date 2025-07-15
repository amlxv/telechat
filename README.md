# TeleChat

A Telegram chatbot powered by OpenAI's GPT-3.5-turbo model that provides intelligent responses to user messages.

## Features

- **AI-Powered Responses**: Uses OpenAI's GPT-3.5-turbo model for intelligent conversation
- **Telegram Integration**: Built with Telegraf framework for seamless Telegram bot functionality
- **Webhook Support**: Configured to work with Telegram webhooks for real-time message processing
- **Conversation Management**: Supports `/new` command to start fresh conversations
- **User Restriction**: Currently configured to only respond to a specific user (`amlxv`)
- **Logging**: Comprehensive logging with Winston for monitoring and debugging

## Tech Stack

- **TypeScript** - Type-safe JavaScript development
- **Telegraf** - Telegram Bot API framework
- **OpenAI API** - GPT-3.5-turbo integration
- **Express.js** - Web server for webhook handling
- **Winston** - Logging framework
- **esbuild** - Fast TypeScript bundling
- **PM2** - Process management for production deployment

## Environment Variables

The bot requires the following environment variables:
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `OPENAI_API_KEY` - Your OpenAI API key
- `TELEGRAM_WEBHOOK_URL` - Webhook URL for Telegram
- `TELEGRAM_WEBHOOK_PORT` - Port for the webhook server

## Usage

The bot responds to text messages and supports the `/new` command to reset the conversation context. It maintains conversation history for contextual responses.
