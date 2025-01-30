import TelegramBot from 'node-telegram-bot-api';
import {options} from "../../utils/botOptions";

export const startHandler = (bot: TelegramBot) => (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;

    // Приветственное сообщение с кнопками

    bot.sendMessage(chatId, 'Привет!😊 Я профессиональный тренер по фитнесу.' +
        '\nЯ помогу тебе создать персонализированную программу тренировок, составить рацион питания и рекомендовать добавки и БАДы, чтобы помочь вам достичь ваших целей. Чем могу помочь?', options);
};
