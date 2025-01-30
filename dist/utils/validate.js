"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWorkoutData = void 0;
const parseWorkoutData = (input) => {
    console.log('🔍 Получен ввод:', input);
    // Ищем ВСЕ числа (предположительно вес и рост)
    const numbers = (input.match(/\b\d{2,3}\b/g) || []).map(Number);
    console.log('📊 Найденные числа:', numbers);
    let weight = null, height = null;
    if (numbers.length >= 2) {
        const [num1, num2] = numbers;
        if (num1 < num2) {
            weight = num1;
            height = num2;
        }
        else {
            weight = num2;
            height = num1;
        }
    }
    else if (numbers.length === 1) {
        weight = numbers[0];
    }
    console.log(`⚖️ Вес: ${weight}, 📏 Рост: ${height}`);
    // Удаляем числа из текста
    let textWithoutNumbers = input.replace(/\b\d{2,3}\b/g, '').trim();
    console.log('📝 Оставшийся текст (без чисел):', textWithoutNumbers);
    // Ключевые слова для активности
    const activityKeywords = ['низкая', 'средняя', 'высокая', 'активный', 'умеренный', 'силовой', 'кардио'];
    // Разделяем текст на слова
    let words = textWithoutNumbers.split(/\s+/).filter(Boolean);
    let activityLevel = null;
    let goal = null;
    // Ищем слово "активность" и берем следующее за ним слово как уровень активности
    const activityIndex = words.findIndex(word => word.toLowerCase() === 'активность');
    if (activityIndex !== -1 && activityIndex + 1 < words.length) {
        const nextWord = words[activityIndex + 1];
        if (activityKeywords.includes(nextWord.toLowerCase())) {
            activityLevel = nextWord; // Сохраняем уровень активности (например, "высокая")
            words.splice(activityIndex, 2); // Удаляем "активность" и уровень активности
        }
    }
    // Ищем цель
    const goalIndex = words.findIndex(word => word.toLowerCase() === 'цель');
    if (goalIndex !== -1) {
        // Берем все слова после "цель" и исключаем ключевые слова активности
        goal = words
            .slice(goalIndex + 1) // Берем все после "цель"
            .filter(word => !activityKeywords.includes(word.toLowerCase())) // Исключаем ключевые слова активности
            .join(' ') // Собираем в строку
            .trim();
    }
    console.log(`🏋️‍♂️ Уровень активности: ${activityLevel}, 🎯 Цель: ${goal}`);
    return {
        weight,
        height,
        activityLevel,
        goal,
    };
};
exports.parseWorkoutData = parseWorkoutData;
