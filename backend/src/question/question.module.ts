import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [],
    providers: [QuestionService],
    controllers: [QuestionController],
    exports: [QuestionService],
  })
export class QuestionModule {}
