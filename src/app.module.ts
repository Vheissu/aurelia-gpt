import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RateLimiterInterceptor(3),
    },
    AuthService,
  ],
})
export class AppModule {}
