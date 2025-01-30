import TelegramBot from 'node-telegram-bot-api';

export const subscriptionHandler = (bot: TelegramBot) => (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;

    // Логика подписки: здесь ты можешь добавить проверку, подписан ли пользователь
    // Например, проверка через ссылку или через бота

    const isSubscribed = true; // Тут будет твоя логика проверки подписки

    if (isSubscribed) {
        bot.sendMessage(chatId, 'Вы успешно подписаны! Теперь можно приступить к тренировкам.');
    } else {
        bot.sendMessage(chatId, 'Для использования бота необходимо подписаться. Напишите /subscribe для подписки.');
    }
};
