import TelegramBot from 'node-telegram-bot-api';
import {options} from "../../utils/botOptions";

export const startHandler = (bot: TelegramBot) => (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;

    // Приветственное сообщение с кнопками

    bot.sendMessage(chatId, 'Привет!😊 Я Бот фитнес-тренер Джонни.' +
        '\nЯ помогу тебе создать персонализированную программу тренировок, чтобы помочь вам достичь твоих целей.', options);
};
