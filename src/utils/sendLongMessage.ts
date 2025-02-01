export const sendLongMessage = async (bot:any,chatId:any,text:string) => {
    let parts = text.match(/[\s\S]{1,4000}/g) || []; // Разбиваем на куски

    for (const part of parts) {
        await bot.sendMessage(chatId, part); // Отправляем каждую часть
    }
};