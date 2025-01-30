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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const subscriptionHandler_1 = require("../handlers/subscriptionHandler");
const startHandler_1 = require("../handlers/startHandler");
const env_1 = require("../../config/env");
const workoutHandler_1 = require("../handlers/workoutHandler");
const botOptions_1 = require("../../utils/botOptions");
const db_1 = __importDefault(require("../../db/db"));
const subscriptionMiddleware_1 = require("../middlewares/subscriptionMiddleware");
// Хранилище состояний в памяти
const userStates = new Map();
const subscriptionStates = new Map(); // true - подписан, false - не подписан
const bot = new node_telegram_bot_api_1.default(env_1.config.BOT_TOKEN, { polling: true });
(0, db_1.default)();
bot.onText(/\/start/, (0, startHandler_1.startHandler)(bot));
bot.onText(/\/subscribe/, (0, subscriptionHandler_1.subscriptionHandler)(bot));
bot.onText(/Подобрать правильное питание/, () => console.log(''));
bot.onText(/Подобрать программу для тренировки/, (msg) => (0, workoutHandler_1.workoutHandler)(bot, userStates)(msg));
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    // Проверяем состояние пользователя
    subscriptionStates.set(chatId, yield (0, subscriptionMiddleware_1.subscriptionUpdateMiddleware)(chatId));
    const subscriptionStatus = subscriptionStates.get(chatId);
    console.log('STT', subscriptionStatus);
    const user = userStates.get(chatId);
    // Логика для проверки подписки
    if (!user && msg.text !== 'Подобрать программу для тренировки' && msg.text !== 'Подобрать правильное питание') {
        if (!subscriptionStatus) {
            bot.sendMessage(chatId, 'Вам доступна только ограниченная версия программы тренировок (нажмите что бы протестировать на кнопку Подобрать программу для тренировки). Для получения полной версии оформите подписку через /subscribe.💰', botOptions_1.options);
            return;
        }
        // Если подписка активна, продолжаем
        bot.sendMessage(chatId, "Нажмите на кнопку 'Подобрать программу для тренировки' или 'Подобрать правильное питание'", botOptions_1.options);
        return;
    }
}));
