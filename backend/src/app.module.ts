import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';
import { AuthService } from './auth/auth.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule, 
    QuestionModule, 
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'RATE_LIMITER',
      useFactory: (userRepository: Repository<User>) => new RateLimiterInterceptor(userRepository, 3),
      inject: [getRepositoryToken(User)],
    },   
    AuthService,
  ],
})
export class AppModule {}
