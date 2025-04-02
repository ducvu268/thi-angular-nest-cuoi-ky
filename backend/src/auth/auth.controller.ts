import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Account } from 'src/account/schemas/account.schema';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() account: Account) {
    return this.authService.login(account.email, account.password);
  }

  @Post('register')
  register(@Body() account: Account) {
    return this.authService.register(account);
  }
}
