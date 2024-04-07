import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
