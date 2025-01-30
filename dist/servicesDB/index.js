"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementUsageCount = exports.addUserToDB = void 0;
const userModel_1 = __importDefault(require("../db/userModel"));
const addUserToDB = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Проверка на существование пользователя
        const existingUser = yield userModel_1.default.findOne({ chatId });
        if (existingUser) {
            console.log('USS', existingUser);
            console.log('User already exists');
            return existingUser; // Возвращаем существующего пользователя
        }
        // Создание нового пользователя с дефолтными значениями
        const newUser = new userModel_1.default({ chatId, subscription: false, usageCount: 0 });
        // Сохранение пользователя в базе данных
        yield newUser.save();
        console.log('User successfully saved to DB');
        return newUser;
    }
    catch (error) {
        console.error('Error saving user to DB:', error);
    }
});
exports.addUserToDB = addUserToDB;
// Функция для обновления счетчика использования
const incrementUsageCount = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ chatId });
        if (user) {
            user.usageCount += 1; // Увеличиваем количество использований
            yield user.save();
            console.log(`User ${chatId} usage count incremented.`);
        }
    }
    catch (error) {
        console.error('Error incrementing usage count:', error);
    }
});
exports.incrementUsageCount = incrementUsageCount;
