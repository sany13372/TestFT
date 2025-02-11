import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import {startHandler} from "../handlers/startHandler";
import {config} from "../../config/env";
import {workoutHandler} from "../handlers/workoutHandler";
import {options} from "../../utils/botOptions";
import connectToDB from "../../db/db";
import {subscriptionUpdateMiddleware} from "../middlewares/subscriptionMiddleware";

const app = express();
const port = 3000; // Указываем порт
const userStates = new Map<number, { awaitingChatGPTResponse: boolean, context: string,type:string,waitingForInput:boolean }>();
const subscriptionStates = new Map<number, boolean>(); // true - подписан, false - не подписан
const bot = new TelegramBot(config.BOT_TOKEN);
connectToDB();

const webhookUrl = `https://testft.onrender.com/bot${config.BOT_TOKEN}`;
bot.setWebHook(webhookUrl)
    .then(() => {
        console.log(`Вебхук установлен на ${webhookUrl}`);
    })
    .catch((error) => {
        console.error('Ошибка при установке вебхука:', error);
    });

// Обработка входящих обновлений через вебхук
app.post(`/bot${config.BOT_TOKEN}`, (req, res) => {
    try {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при обработке обновления:', error);
        res.sendStatus(500);
    }
});
bot.onText(/\/start/, startHandler(bot));
bot.onText(/Подобрать программу для тренировки/, (msg) => workoutHandler(bot,userStates)(msg))

bot.on('message', async (msg) => {
    try {
        const chatId = msg.chat.id;
        // Проверяем состояние пользователя
        subscriptionStates.set(chatId,await subscriptionUpdateMiddleware(msg))
        const subscriptionStatus = subscriptionStates.get(chatId)
        const user = userStates.get(chatId)
        // Логика для проверки подписки
        if (!user && msg.text !== 'Подобрать программу для тренировки') {
            if (!subscriptionStatus) {
                bot.sendMessage(chatId, 'Вам доступна только ограниченная версия программы тренировок \\(нажмите, чтобы протестировать, на кнопку *Подобрать программу для тренировки*\\)\\. Для оформления полной версии напишите нашему [менеджеру](https:\\/\\/t\\.me\\/aibot\\_manager)\\.💰', {
                    parse_mode: "MarkdownV2",
                    reply_markup: {
                        keyboard: [
                            [{ text: 'Подобрать программу для тренировки' }]
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });

                return;
            }

            // Если подписка активна, продолжаем
            bot.sendMessage(chatId, "Нажмите на кнопку 'Подобрать программу для тренировки'",options);
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

app.get('/wakeup', (req, res) => {
    res.send('Сервер активен!');
});