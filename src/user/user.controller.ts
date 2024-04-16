import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { user } from '@prisma/client';
import { DeleteUserDto, FindUserDto, UpdatePasswordDto, UpdateUserDto, UserPagerDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {

    constructor(readonly userService : UserService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async find(@Request() req, @Query() query: FindUserDto):Promise<user>{
        return await this.userService.find(query);
    }

    @Get('getall')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async users(@Query() query: UserPagerDto):Promise<user>{
        return await this.userService.findUsers(query);
    }

    @Post('update')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    public async update(@Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(updateUserDto);
    }

    @Put('update/password')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    public async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
        return await this.userService.updatePassword(updatePasswordDto, req.user.id);
    }

    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    public async delete(@Body() deleteUserDto: DeleteUserDto) {
        return await this.userService.delete(deleteUserDto);
    }
}
