import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "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",
});
//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


export const chatWithGPT = async (prompt: string) => {
    const content =  `
Ты фитнес-тренер. Ты можешь отвечать только на вопросы, связанные с тренировками, фитнесом, здоровым образом жизни, питанием и достижением физических целей (например, похудение, набор массы и т.д.). 
Ты не можешь отвечать на вопросы, которые выходят за рамки этих тем. Если пользователь задаёт вопрос, не связанный с фитнесом, скажи: "Извините, я могу помочь только с вопросами о фитнесе и тренировках.".
`
    try {
        const response = await openai.chat.completions.create({
    // model: "gpt-3.5-turbo",
            model: 'gpt-4o-mini',  // Указываем модель GPT-4o mini
            store: true,
            messages: [
                { role: "system", content: 'Запомни любое сообщение что ты мне присылаешь не должно быть больше 4000 символов!' },
                {
                    role: "user",
                    content: prompt,
                },
            ],
});
        return response.choices[0].message.content
    } catch (error) {
        console.error('Ошибка при запросе к Фитнес Боту', error);
        return null;
    }
};

// import OpenAI from "openai";
//
// const openai = new OpenAI({
//     apiKey: "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",
// });
//
// const completion = openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     store: true,
//     messages: [
//         {"role": "user", "content": "write a haiku about ai"},
//     ],
// });
//
// completion.then((result) => console.log(result.choices[0].message));