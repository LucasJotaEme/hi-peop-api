import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post
} from '@nestjs/common';
import {AuthService, RegistrationStatus} from "./auth.service";
import {ApiTags} from "@nestjs/swagger";
import { CreateUserDto } from 'src/user/user.dto';
import { LoginUserDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    public async register(@Body() createUserDto: CreateUserDto ): Promise<RegistrationStatus> {
        
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return await this.authService.login(loginUserDto);
    }

}