import dotenv from 'dotenv';

dotenv.config();

export const config = {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    DB_URL:process.env.DB_URL || ''
};