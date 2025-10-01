import { Injectable } from '@nestjs/common';
import { CreateDto } from './dtos/create-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dtos/login-dto';
import * as bcrypt from 'bcrypt';   
import { jwtConstants } from './jwt-token';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
   constructor(
     private readonly prisma: PrismaService,
     private readonly jwtService: JwtService, // JwtService injetado corretamente
   ) {}
    
   async create(body: CreateDto) {
     const user = await this.prisma.user.findUnique({
        where: { email: body.email },
     });

     if (user) {
        throw new Error('email ja cadastrado');
     }

     const hashPassword = bcrypt.hashSync(body.password, 10);

     const user1 = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashPassword,  
        },
     });

     return {
         name: body.name,
         email: body.email,
         createdAt: new Date(),
         updatedAt: new Date(),
     };
   }

   async login(body: LoginDto) {
     const user = await this.prisma.user.findUnique({
        where: { email: body.email },
     });

     if (!user) {
        throw new Error('usuario nao encontrado');
     }

     const isPasswordMatch = await bcrypt.compare(body.password, user.password);

     if (!isPasswordMatch) {
        throw new Error('credenciais invalidas');
     }

     const payload = {
        sub: user.id,
        email: user.email,
     };

     const token = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h',
     });

     const refreshToken = this.jwtService.sign(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
     });

     return {
        token,
        refreshToken,
     };
   }
}
