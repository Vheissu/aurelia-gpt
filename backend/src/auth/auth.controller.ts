import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get("github")
  @UseGuards(AuthGuard("github"))
  async githubAuth(@Req() req) {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  githubAuthRedirect(@Req() req) {
    return this.authService.githubLogin(req);
  }

  @Get("logout")
  async logout(@Req() req) {
    req.logout();
    return { message: "Logged out successfully" };
  }
}
