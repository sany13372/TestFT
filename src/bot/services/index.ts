import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import {subscriptionHandler} from "../handlers/subscriptionHandler";
import {startHandler} from "../handlers/startHandler";
import {config} from "../../config/env";
import {workoutHandler} from "../handlers/workoutHandler";
import {options} from "../../utils/botOptions";
import connectToDB from "../../db/db";
import {subscriptionUpdateMiddleware} from "../middlewares/subscriptionMiddleware";

const app = express();
const port = 3000; // Указываем порт
// Хранилище состояний в памяти
const userStates = new Map<number, { awaitingChatGPTResponse: boolean, context: string,type:string,waitingForInput:boolean }>();
const subscriptionStates = new Map<number, boolean>(); // true - подписан, false - не подписан
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });
connectToDB();

bot.onText(/\/start/, startHandler(bot));
bot.onText(/\/subscribe/, subscriptionHandler(bot));
bot.onText(/Подобрать правильное питание/, () => console.log(''));
bot.onText(/Подобрать программу для тренировки/, (msg) => workoutHandler(bot,userStates)(msg))

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

bot.on('message', async (msg) => {
    try {
        const chatId = msg.chat.id;
        // Проверяем состояние пользователя
        subscriptionStates.set(chatId,await subscriptionUpdateMiddleware(chatId,msg?.chat?.username || ''))
        const subscriptionStatus = subscriptionStates.get(chatId)
        const user = userStates.get(chatId)
        // Логика для проверки подписки
        if (!user && msg.text !== 'Подобрать программу для тренировки' && msg.text !== 'Подобрать правильное питание') {
            if (!subscriptionStatus) {
                bot.sendMessage(chatId, 'Вам доступна только ограниченная версия программы тренировок (нажмите что бы протестировать на кнопку Подобрать программу для тренировки). Для получения полной версии оформите подписку через /subscribe.💰',options);
                return;
            }

            // Если подписка активна, продолжаем
            bot.sendMessage(chatId, "Нажмите на кнопку 'Подобрать программу для тренировки' или 'Подобрать правильное питание'",options);
            return;
        }
    }
    catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
    }

});

app.get('/', (req, res) => {
    res.send('Сервер бота работает!');
});

// Запуск Express-сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

app.get('/wakeup', (req, res) => {
    res.send('Сервер активен!');
});