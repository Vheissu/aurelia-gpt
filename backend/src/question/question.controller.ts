import { Controller, Post, Request, UseInterceptors, Body, Inject } from '@nestjs/common';
import { RateLimiterInterceptor } from '../rate-limiter.interceptor';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
    constructor(
        @Inject(RateLimiterInterceptor)
        private rateLimiterInterceptor: RateLimiterInterceptor,
        private readonly questionService: QuestionService
    ) {}
    
    @UseInterceptors(RateLimiterInterceptor)
    @Post()
    async ask(@Request() req, @Body('question') question: string) {
        const answer = await this.questionService.ask(question);

        return answer;
    }
}
