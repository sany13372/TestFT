import {addUserToDB, updateUserSubscription} from "../../servicesDB";

const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split(".").map(Number);
    return new Date(year, month - 1, day); // month - 1, так как месяцы в JS начинаются с 0
};

export const subscriptionUpdateMiddleware = async (msg:any) => {
    // Проверяем наличие пользователя в базе данных и его статус подписки
    const user = await addUserToDB(msg);

    if (!user || !user.dateSubscription) return false; // Если нет данных, подписки нет
    const currentDate = new Date();
    const subscriptionDate = parseDate(user.dateSubscription); // Парсим дату подписки

    if (subscriptionDate > currentDate) {
        return true; // Подписка активна, ничего не меняем
    } else {
        // Подписка истекла, очищаем поле в БД
        await updateUserSubscription(msg.chat.id, '');
        return false; // Подписка закончилась
    }
};