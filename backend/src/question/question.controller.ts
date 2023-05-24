import {
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  Body,
  Inject,
} from "@nestjs/common";
import { RateLimiterInterceptor } from "../rate-limiter.interceptor";
import { QuestionService } from "./question.service";

@Controller("questions")
export class QuestionController {
  constructor(
    @Inject("RATE_LIMITER")
    private readonly rateLimiter: RateLimiterInterceptor,
    private readonly questionService: QuestionService
  ) {}

  @UseInterceptors(RateLimiterInterceptor)
  @Post()
  async askQuestion(@Request() req, @Body("question") question: string) {
    const answer = await this.questionService.ask(question);

    return answer;
  }
}
