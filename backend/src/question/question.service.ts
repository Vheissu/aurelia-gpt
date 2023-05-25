import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';

const vectorPath = `vectors`;

@Injectable()
export class QuestionService {
    constructor(private configService: ConfigService) {}

    async ask(question: string) {
        if (!question) {
            throw new Error('Missing question');
        }

        const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');

        if (!openAIApiKey) {
            throw new Error('Missing OPENAI_API_KEY');
        }

        const model = new OpenAI({
            openAIApiKey,
            modelName: this.configService.get<string>('OPENAI_MODEL'),
        });

        const vectorStore = await HNSWLib.load(vectorPath, new OpenAIEmbeddings({ openAIApiKey }));

        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

        const res = await chain.call({
            query: question,
        });

        if (res.text) {
            return res.text;
        } else {
            return 'There was an error.';
        }
    }
}
