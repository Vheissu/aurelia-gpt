import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from '../user.entity';

@Module({
    imports: [
      PassportModule,
      TypeOrmModule.forFeature([User]),
    ],
    providers: [AuthService, GoogleStrategy, GithubStrategy],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}
