import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для пользователя
export interface IUser extends Document {
    chatId: number;
    subscription: boolean; // true - подписка есть, false - нет
    usageCount: number; // количество использований
}

// Создание схемы для пользователя
const userSchema: Schema<IUser> = new Schema({
    chatId: { type: Number, required: true, unique: true }, // chatId для уникальной идентификации пользователя
    subscription: { type: Boolean, default: false }, // по умолчанию без подписки
    usageCount: { type: Number, default: 0 }, // по умолчанию 0
});

// Создание модели для работы с данными
const User = mongoose.model<IUser>('User', userSchema);

export default User;