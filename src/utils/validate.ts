// export const parseWorkoutData = (input: string) => {
//     // Извлекаем ВСЕ числа (кол-во тренировок, вес, рост)
//     const numbers = (input.match(/\b\d{1,3}\b/g) || []).map(Number);
//
//     let workoutCount: number | null = null;
//     let weight: number | null = null;
//     let height: number | null = null;
//
//     if (numbers.length === 3) {
//         // Самое маленькое — количество тренировок, среднее — вес, самое большое — рост
//         numbers.sort((a, b) => a - b);
//         [workoutCount, weight, height] = numbers;
//     } else if (numbers.length === 2) {
//         // Если введено два числа, предполагаем, что это вес и рост
//         [weight, height] = numbers.sort((a, b) => a - b);
//
//         // Пользователь не указал количество тренировок — оставляем null
//     }
//
//     // Удаляем числа из текста
//     let textWithoutNumbers = input.replace(/\b\d{1,3}\b/g, '').trim();
//
//     // Определяем уровень активности
//     const activityKeywords = ['низкая', 'средняя', 'высокая'];
//     let activityLevel: string | null = null;
//     for (const keyword of activityKeywords) {
//         if (textWithoutNumbers.toLowerCase().includes(keyword)) {
//             activityLevel = keyword;
//             textWithoutNumbers = textWithoutNumbers.replace(keyword, '').trim();
//             break;
//         }
//     }
//
//     // Определяем цель
//     const goalKeywords = ['набрать массу', 'похудеть', 'поддержание формы'];
//     let goal: string | null = null;
//     for (const keyword of goalKeywords) {
//         if (textWithoutNumbers.toLowerCase().includes(keyword)) {
//             goal = keyword;
//             break;
//         }
//     }
//
//     return {
//         workoutCount,
//         weight,
//         height,
//         activityLevel,
//         goal,
//     };
// };

export const parseWorkoutData = (input: string) => {
    let lines: string[];

    if (input.includes(',')) {
        // Если есть запятые, разбиваем по ним
        lines = input.split(',').map(line => line.trim());
    } else {
        // Иначе разбиваем по строкам
        lines = input.split('\n').map(line => line.trim());
    }

    // Убираем пустые строки
    lines = lines.filter(line => line.length > 0);

    // Проверяем, что введено ровно 5 параметров

    // Обрабатываем параметры
    const weight = Number(lines[0]);
    const height = Number(lines[1]);
    const activityLevel = lines[2].toLowerCase();
    const goal = lines[3].toLowerCase();
    const workoutCount = Number(lines[4]);

    // Проверка корректности числовых значений

    // Проверка корректности уровня активности
    const validActivityLevels = ['высокая', 'средняя', 'низкая'];

    // Проверка корректности цели
    const validGoals = ['похудение', 'набор массы', 'поддержание формы'];

    return {
        weight,
        height,
        activityLevel,
        goal,
        workoutCount,
    };
};
