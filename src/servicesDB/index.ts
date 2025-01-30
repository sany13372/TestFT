import User from "../db/userModel";

export const addUserToDB = async (chatId: number,userName:string) => {
    try {
        // Проверка на существование пользователя
        const existingUser = await User.findOne({ chatId });
        if (existingUser) {
            console.log('User already exists');
            return existingUser; // Возвращаем существующего пользователя
        }
        // Создание нового пользователя с дефолтными значениями
        const newUser = new User({ chatId, subscription: false, usageCount: 0,userName:userName });

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