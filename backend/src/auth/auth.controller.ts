import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private config: ConfigService
    ) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req);
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth(@Req() req) {}

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    githubAuthRedirect(@Req() req, @Res() res: Response) {
        const accessToken = req.user.accessToken;
        const frontendURL = this.config.get<string>('FRONTEND_URL');

        res.redirect(`${frontendURL}?accessToken=${accessToken}`);
    }

    @Get('logout')
    async logout(@Req() req) {
        req.logout();
        return { message: 'Logged out successfully' };
    }
}
