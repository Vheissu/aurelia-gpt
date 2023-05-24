import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
  ],
})
export class AppModule {}
