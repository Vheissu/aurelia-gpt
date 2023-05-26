import { OpenAI } from 'langchain/llms/openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI Credentials');
}

export const openaiClient = new OpenAI({
    temperature: 0,
    modelName: process.env.OPENAI_MODEL,
    openAIApiKey: process.env.OPENAI_API_KEY,
});


export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;