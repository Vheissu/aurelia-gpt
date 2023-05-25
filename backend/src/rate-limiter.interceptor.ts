import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
    private readonly bucketSize: number = 3;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) {
        this.bucketSize = parseInt(this.configService.get<string>('USER_PROMPT_LIMIT'));
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);
        }

        const token = authorization.split(' ')[1];
        const octokit = new Octokit({
            auth: token,
        });

        const userGitHub = await octokit.users.getAuthenticated();
        const user = await this.userRepository.findOne({ where: { githubId: userGitHub.data.id } });

        if (!user) {
            throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED);
        }

        // Check if 24 hours have passed since firstQueryTimestamp
        const currentTime = new Date();
        const resetTime = new Date(user.firstQueryTimestamp);
        resetTime.setHours(resetTime.getHours() + 24);

        if (currentTime >= resetTime) {
            // Reset queryCount and update firstQueryTimestamp
            user.queryCount = 0;
            user.firstQueryTimestamp = currentTime;
        }

        if (user.queryCount < this.bucketSize) {
            user.queryCount++;
            await this.userRepository.save(user);
            return next.handle();
        } else {
            throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
        }
    }
}
