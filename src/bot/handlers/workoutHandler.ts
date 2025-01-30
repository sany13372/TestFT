import TelegramBot from 'node-telegram-bot-api';
import {chatWithGPT} from "../services/openaiService";
import {
    additionalTextTrainer,
    frontTextTrainner,
    promptDescTrainer
} from "../../utils/promtsText";
import {parseWorkoutData} from "../../utils/validate";
import {subscriptionUpdateMiddleware} from "../middlewares/subscriptionMiddleware";
import {options} from "../../utils/botOptions";

export const workoutHandler = (bot: TelegramBot, userStates: Map<number, { awaitingChatGPTResponse: boolean, context: string, type: string, waitingForInput: boolean }>) => async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const isSubscribe = await subscriptionUpdateMiddleware(chatId,msg?.chat?.username || '') || false;

    // Проверяем, если пользователь уже в процессе ввода данных
    const existingState = userStates.get(chatId);
    if (existingState?.waitingForInput || existingState?.awaitingChatGPTResponse) {
        bot.sendMessage(chatId, 'Вы уже начали процесс подбора тренировки. Пожалуйста, введите данные.');
        return;
    }

    // Устанавливаем состояние ожидания ввода
    userStates.set(chatId, { awaitingChatGPTResponse: false, context: '', type: 'workout', waitingForInput: true });

    // Отправляем сообщение с инструкциями
    bot.sendMessage(chatId, 'Введите ваши параметры в формате: "вес: 70, рост: 175, активность: (высокая, низкая), цель: (похудеть, набрать массу)".');

    const messageHandler = async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;

        const userState = userStates.get(chatId);

        if (!userState || !userState.waitingForInput) return;

        const userInput = msg.text?.trim();
        const parsedData = parseWorkoutData(userInput || '');
        const errText = 'Произошла ошибка. Попробуйте еще раз.'
        if (parsedData.weight && parsedData.height && parsedData.activityLevel && parsedData.goal) {
            const typingInterval = setInterval(() => {
                bot.sendChatAction(chatId, 'typing');
            }, 4000);
            try {
                userStates.set(chatId, { awaitingChatGPTResponse: true, context: '', type: 'workout', waitingForInput: false });

                await bot.sendChatAction(chatId, 'typing');
                const prompt = `Ты профессиональный фитнес-тренер. Составь ${promptDescTrainer(isSubscribe)} тренировочную программу для меня с весом ${parsedData.weight} кг, ростом ${parsedData.height} см, уровнем активности ${parsedData.activityLevel} и целью ${parsedData.goal}.`;
                const response = await chatWithGPT(prompt);
                clearInterval(typingInterval); // Останавливаем 'typing', когда получили ответ
                //@ts-ignore
                const finalText = ` ${frontTextTrainner(parsedData,msg.chat.first_name)}\n${response}\n\n${!isSubscribe ? additionalTextTrainer(isSubscribe) : ''}`;

                bot.sendMessage(chatId, response ? finalText : errText,options);
                userStates.delete(chatId); // Удаляем состояние после выполнения
            } catch (er) {
                clearInterval(typingInterval); // Останавливаем 'typing' при ошибке
                bot.sendMessage(chatId, errText,options);
            }
        } else {
            bot.sendMessage(chatId, '❌ Некоторые данные отсутствуют. Пожалуйста, убедитесь, что вы указали все параметры (вес, рост, активность и цель).');
            // Важный момент: оставляем обработчик активным до получения правильных данных
            bot.once('message', messageHandler); // Только один раз
        }
    };

    // Подписываемся на одно сообщение от пользователя
    bot.once('message', messageHandler);
};






