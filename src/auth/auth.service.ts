import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./jwt.strategy";
import {PrismaClient, User} from '@prisma/client'
import {hash} from "bcrypt";
import { UserService } from 'src/user/user.service';
import { CreateUserDto, } from 'src/user/user.dto';
import { LoginUserDto } from './auth.dto';


const prisma = new PrismaClient();

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(userCreateDto: CreateUserDto): Promise<any> {
        
        let status: RegistrationStatus = {
            success: true,
            expiresIn: '',
            Authorization: ''
        };
        
        try {
            status.data = await this.userService.create(userCreateDto);
            const token = this._createToken(await this.setLoginUserDto(userCreateDto));

            status = {
                ...status,
                expiresIn: token.expiresIn,
                Authorization: token.Authorization
            }
            
        } catch (error) {
            console.log(error);
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        return status;
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userService.findByLogin(loginUserDto);
        const token = this._createToken(user);

        return {
            ...token,
            data: user
        };
    }

    private _createToken({ email }): any {
        const user: JwtPayload = { email };
        const Authorization = this.jwtService.sign(user);
        return {
            expiresIn: process.env.EXPIRESIN,
            Authorization,
        };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        const user = await this.userService.find(payload);
        if (!user) {
            throw new HttpException("INVALID_TOKEN", 
               HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async setLoginUserDto(userDto: CreateUserDto): Promise<LoginUserDto>{

        let loginUserDto = new LoginUserDto();
        loginUserDto.email = userDto.email;
        loginUserDto.password = userDto.password;

        return loginUserDto;
    }
}

export interface RegistrationStatus{
    success: boolean;
    expiresIn?: string;
    Authorization?: string;
    data?: User;
}
export interface RegistrationSeederStatus {
    success: boolean;
    message: string;
    data?: User[];
}