import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { ConfigModule } from '@nestjs/config';
import { User } from '..//user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimiterInterceptor } from '../rate-limiter.interceptor';

@Module({
    imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User])],
    providers: [QuestionService, RateLimiterInterceptor],
    controllers: [QuestionController],
    exports: [QuestionService],
})
export class QuestionModule {}
