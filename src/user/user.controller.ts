import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { FindUserDto, CreateUserDto, UpdatePasswordDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {

    constructor(readonly userService : UserService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async find(@Query() query: FindUserDto):Promise<User>{
        return await this.userService.find(query);
    }

    @Put('update/password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    public async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
        return await this.userService.updatePassword(updatePasswordDto, req.user.id);
    }
}
