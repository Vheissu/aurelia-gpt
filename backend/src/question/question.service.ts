import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RetrievalQAChain, VectorDBQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';

import { openaiClient, OPENAI_API_KEY } from './../core/openai-client';
import { supabaseClient } from '../core/supabase-client';

@Injectable()
export class QuestionService {
    constructor(private configService: ConfigService) {}

    async ask(question: string) {
        if (!question) {
            throw new Error('Missing question');
        }

        const vectorStore = await SupabaseVectorStore.fromExistingIndex(
            new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
            {
                client: supabaseClient,
            }
        );

        const chain = RetrievalQAChain.fromLLM(openaiClient, vectorStore.asRetriever());

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
