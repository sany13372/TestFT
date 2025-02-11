import User from "../db/userModel";

export const addUserToDB = async (msg:any) => {
    const chatId = msg.chat.id;
    const firstName = msg.chat.first_name;
    const lastName = msg.chat.last_name || '';
    const username = msg.chat.username || '';

    const userData = {
        chatId,
        firstName,
        lastName,
        username,
        subscription: false,
        dateSubscription:'',
        usageCount: 0,
    };
    try {
        // Проверка на существование пользователя
        const existingUser = await User.findOne({ chatId });
        if (existingUser) {
            await User.findOneAndUpdate(
                { chatId }, // Поиск по chatId
                { firstName },
                { new: true } // Возвращает обновленный документ
            );
            return existingUser
        }

        // Создание нового пользователя с дефолтными значениями
        const newUser = new User(userData);

        // Сохранение пользователя в базе данных
        await newUser.save();
        console.log('User successfully saved to DB');
        return newUser;
    } catch (error) {
        console.error('Error saving user to DB:', error);
    }
};

// Функция для обновления счетчика использования
export const incrementUsageCount = async (chatId: number) => {
    try {
        const user = await User.findOne({ chatId });
        if (user) {
            user.usageCount += 1; // Увеличиваем количество использований
            await user.save();
            console.log(`User ${chatId} usage count incremented.`);
        }
    } catch (error) {
        console.error('Error incrementing usage count:', error);
    }
};

export const updateUserSubscription = async (chatId: number, dateSubscription: string | null) => {
    try {
        // Обновляем дату подписки у пользователя
        const updatedUser = await User.findOneAndUpdate(
            { chatId }, // Поиск по chatId
            { dateSubscription }, // Обновление поля dateSubscription
            { new: true } // Возвращает обновленный документ
        );

        if (updatedUser) {
            console.log(`Subscription updated for user ${chatId}: ${dateSubscription}`);
            return updatedUser;
        } else {
            console.log(`User ${chatId} not found`);
        }
    } catch (error) {
        console.error(`Error updating subscription for user ${chatId}:`, error);
    }
};
