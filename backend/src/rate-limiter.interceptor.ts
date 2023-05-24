import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private readonly bucketSize: number;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    bucketSize: number,
  ) {
    this.bucketSize = bucketSize;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const user = request.user;

    if (!user) {
      throw new HttpException(
        'Unauthenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const dbUser = await this.userRepository.findOne(user.id);

    if (!dbUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dbUser.queryCount < this.bucketSize) {
      dbUser.queryCount++;
      await this.userRepository.save(dbUser);
      return next.handle();
    } else {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
