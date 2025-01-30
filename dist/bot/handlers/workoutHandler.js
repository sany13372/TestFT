"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutHandler = void 0;
const openaiService_1 = require("../services/openaiService");
const promtsText_1 = require("../../utils/promtsText");
const validate_1 = require("../../utils/validate");
const subscriptionMiddleware_1 = require("../middlewares/subscriptionMiddleware");
const botOptions_1 = require("../../utils/botOptions");
const workoutHandler = (bot, userStates) => (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const isSubscribe = (yield (0, subscriptionMiddleware_1.subscriptionUpdateMiddleware)(chatId)) || false;
    // Проверяем, если пользователь уже в процессе ввода данных
    const existingState = userStates.get(chatId);
    if ((existingState === null || existingState === void 0 ? void 0 : existingState.waitingForInput) || (existingState === null || existingState === void 0 ? void 0 : existingState.awaitingChatGPTResponse)) {
        bot.sendMessage(chatId, 'Вы уже начали процесс подбора тренировки. Пожалуйста, введите данные.');
        return;
    }
    // Устанавливаем состояние ожидания ввода
    userStates.set(chatId, { awaitingChatGPTResponse: false, context: '', type: 'workout', waitingForInput: true });
    // Отправляем сообщение с инструкциями
    bot.sendMessage(chatId, 'Введите ваши параметры в формате: "вес: 70, рост: 175, активность: (высокая, низкая), цель: (похудеть, набрать массу)".');
    const messageHandler = (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const chatId = msg.chat.id;
        const userState = userStates.get(chatId);
        if (!userState || !userState.waitingForInput)
            return;
        const userInput = (_a = msg.text) === null || _a === void 0 ? void 0 : _a.trim();
        const parsedData = (0, validate_1.parseWorkoutData)(userInput || '');
        const errText = 'Произошла ошибка. Попробуйте еще раз.';
        if (parsedData.weight && parsedData.height && parsedData.activityLevel && parsedData.goal) {
            const typingInterval = setInterval(() => {
                bot.sendChatAction(chatId, 'typing');
            }, 4000);
            try {
                userStates.set(chatId, { awaitingChatGPTResponse: true, context: '', type: 'workout', waitingForInput: false });
                yield bot.sendChatAction(chatId, 'typing');
                const prompt = `Ты профессиональный фитнес-тренер. Составь ${(0, promtsText_1.promptDescTrainer)(isSubscribe)} тренировочную программу для меня с весом ${parsedData.weight} кг, ростом ${parsedData.height} см, уровнем активности ${parsedData.activityLevel} и целью ${parsedData.goal}.`;
                const response = yield (0, openaiService_1.chatWithGPT)(prompt);
                clearInterval(typingInterval); // Останавливаем 'typing', когда получили ответ
                //@ts-ignore
                const finalText = ` ${(0, promtsText_1.frontTextTrainner)(parsedData, msg.chat.first_name)}\n${response}\n\n${!isSubscribe ? (0, promtsText_1.additionalTextTrainer)(isSubscribe) : ''}`;
                bot.sendMessage(chatId, response ? finalText : errText, botOptions_1.options);
                userStates.delete(chatId); // Удаляем состояние после выполнения
            }
            catch (er) {
                clearInterval(typingInterval); // Останавливаем 'typing' при ошибке
                bot.sendMessage(chatId, errText, botOptions_1.options);
            }
        }
        else {
            bot.sendMessage(chatId, '❌ Некоторые данные отсутствуют. Пожалуйста, убедитесь, что вы указали все параметры (вес, рост, активность и цель).');
            // Важный момент: оставляем обработчик активным до получения правильных данных
            bot.once('message', messageHandler); // Только один раз
        }
    });
    // Подписываемся на одно сообщение от пользователя
    bot.once('message', messageHandler);
});
exports.workoutHandler = workoutHandler;
