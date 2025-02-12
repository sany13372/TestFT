import OpenAI from 'openai';
import {config} from "../../config/env";

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

export const chatWithGPT = async (prompt: string) => {
    const content =  `
Ты фитнес-тренер. Ты можешь отвечать только на вопросы, связанные с тренировками, фитнесом, здоровым образом жизни, питанием и достижением физических целей (например, похудение, набор массы и т.д.). 
Ты не можешь отвечать на вопросы, которые выходят за рамки этих тем. Если пользователь задаёт вопрос, не связанный с фитнесом, скажи: "Извините, я могу помочь только с вопросами о фитнесе и тренировках.".
`
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',  // Указываем модель GPT-4o mini
            store: true,
            messages: [
                { role: "system", content: 'Запомни любое сообщение что ты мне присылаешь не должно быть больше 3500 символов!' },
                {
                    role: "user",
                    content: prompt,
                },
            ],
});
        return response.choices[0].message.content || ''
    } catch (error) {
        console.error('Ошибка при запросе к Фитнес Боту', error);
        return null;
    }
};