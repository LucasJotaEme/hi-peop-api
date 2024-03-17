import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {

    constructor(readonly userService : UserService){}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: UserDto):Promise<User>{
        return await this.userService.create(body);
    }
}
