import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для пользователя
export interface IUser extends Document {
    chatId: number;
    userName: string;
    firstName: string;
    lastName: string;
    subscription: boolean;
    dateSubscription: string;
    usageCount: number;
}

// Создание схемы для пользователя
const userSchema: Schema<IUser> = new Schema({
    chatId: { type: Number, required: true, unique: true }, // chatId для уникальной идентификации пользователя
    userName: { type: String }, // Убираем уникальность
    firstName: { type: String },
    lastName: { type: String },
    subscription: { type: Boolean, default: false },
    dateSubscription: { type: String, default: '' },
    usageCount: { type: Number, default: 0 },
});

// Создание модели для работы с данными
const User = mongoose.model<IUser>('User', userSchema);

export default User;
