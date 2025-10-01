import {
  Body,
  Controller,
 
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateDto } from './dtos/create-dto';
import { LoginDto } from './dtos/login-dto';


@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 @Post('creat')
 create(@Body() body: CreateDto) {
    return this.authService.create(body);
 }

 @Post('login')
 login(@Body() body:  LoginDto) {
    return this.authService.login(body);
 }

}
