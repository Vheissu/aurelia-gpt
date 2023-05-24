import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { openai } from 'openai';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}
    
      async validateUser(githubId: string, googleId: string): Promise<any> {
        let user = await this.usersRepository.findOne({ githubId, googleId });
        if (!user) {
          user = this.usersRepository.create({ githubId, googleId });
          await this.usersRepository.save(user);
        }
        return user;
      }
    
      async saveUser(user: User) {
        await this.usersRepository.save(user);
      }
    
      async askQuestion(user: User, question: string) {
        const currentDate = new Date();
    
        // If it's the first query or the first query was more than 24 hours ago, reset the timestamp and the count
        if (!user.firstQueryTimestamp || currentDate.getTime() - user.firstQueryTimestamp.getTime() > 24 * 60 * 60 * 1000) {
          user.firstQueryTimestamp = currentDate;
          user.queryCount = 0;
        }
    
        // Check if the user has hit their query limit
        if (user.queryCount >= 100) {
          throw new Error('You have hit your daily question limit');
        }
    
        // If the user hasn't hit their limit, increment their count and save
        user.queryCount++;
        await this.saveUser(user);
    
        // Use the OpenAI API to answer the question
        const response = await openai.Completion.create({
          engine: "text-davinci-002",
          prompt: question,
          max_tokens: 60,
        });
    
        return response.choices[0].text;
      }
}