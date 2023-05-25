import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async validateGithubUser(githubId: number): Promise<User> {
        return await this.userRepository.findOne({ where: { githubId: githubId } });
    }

    async validateGoogleUser(googleId: string): Promise<User> {
        return await this.userRepository.findOne({ where: { googleId: googleId } });
    }

    async saveUser(user: User) {
        return await this.userRepository.save(user);
    }

    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }

        return {
            message: 'User information from google',
            user: req.user,
        };
    }

    githubLogin(req) {
        if (!req.user) {
            return 'No user from github';
        }

        return {
            message: 'User information from github',
            user: req.user,
        };
    }
}
