import * as dotenv from 'dotenv';
dotenv.config();

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user.entity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.GITHUB_CALLBACK_URL}`,
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        const { id } = profile;
        let user = await this.userRepository.findOne({ where: { githubId: id } });

        if (!user) {
            user = await this.userRepository.save({
                githubId: id,
                queryCount: 0,
                accessToken,
            });
        }

        (user as any).accessToken = accessToken;

        done(null, user);
    }
}
