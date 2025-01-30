"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHandler = void 0;
const botOptions_1 = require("../../utils/botOptions");
const startHandler = (bot) => (msg) => {
    const chatId = msg.chat.id;
    // Приветственное сообщение с кнопками
    bot.sendMessage(chatId, 'Привет!😊 Я профессиональный тренер по фитнесу.' +
        '\nЯ помогу тебе создать персонализированную программу тренировок, составить рацион питания и рекомендовать добавки и БАДы, чтобы помочь вам достичь ваших целей. Чем могу помочь?', botOptions_1.options);
};
exports.startHandler = startHandler;
