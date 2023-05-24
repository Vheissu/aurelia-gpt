import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private readonly bucketSize: number;
  private readonly tokens: Map<string, number>;
  private readonly lastRefill: Map<string, number>;

  constructor(bucketSize: number) {
    this.bucketSize = bucketSize;
    this.tokens = new Map();
    this.lastRefill = new Map();
  }

  private refillTokens(ip: string, now: number): void {
    const lastRefillTime = this.lastRefill.get(ip) || now;
    const elapsedTime = now - lastRefillTime;
  
    if (elapsedTime >= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      this.tokens.set(ip, this.bucketSize);
      this.lastRefill.set(ip, now);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const ip = request.ip;
    const now = Date.now();
  
    if (!this.tokens.has(ip)) {
      this.tokens.set(ip, this.bucketSize);
    }
  
    this.refillTokens(ip, now);
  
    const tokens = this.tokens.get(ip);
  
    if (tokens > 0) {
      this.tokens.set(ip, tokens - 1);
      return next.handle();
    } else {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
