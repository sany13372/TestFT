import {addUserToDB} from "../../servicesDB";

export const subscriptionUpdateMiddleware = async (chatId: number) => {
    // Проверяем наличие пользователя в базе данных и его статус подписки
    const user = await addUserToDB(chatId);
    const subscriptionStatus = user?.subscription || false; // Получаем статус подписки

    // Обновляем состояние подписки
    return subscriptionStatus;
};