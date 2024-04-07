import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient,User, UserType } from '@prisma/client';
import {compare, hash} from 'bcrypt'
import { CreateUserDto, FindUserDto, UpdatePasswordDto } from './user.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { LoginUserDto } from 'src/auth/auth.dto';

const prisma = new PrismaClient();

interface FormatLogin extends Partial<User> {
    email: string
}
@Injectable()
export class UserService {
    
    async create(data : CreateUserDto): Promise<any> {
        const existingUser = await prisma.user.findUnique({where: {email: data.email}});
        
        if(existingUser){
            throw new ConflictException(`Email ${data.email} already exists`);
        }
        
        return await prisma.user.create({
            data: {
                ...data,
                userType: await this.transformUserTYpe(data.userType),
                password: await hash(data.password, 10)
            }
        });
    }

    async find(payload: FindUserDto | JwtPayload): Promise<User> {
        
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { id: payload.id === undefined ? 0 : parseInt(payload.id) },
                    { email: payload.email }
                ]
            }
        });
        
        if(users.length === 0){
            throw new NotFoundException();
        }
        return users[0];
    }

    async findByLogin({email,password}: LoginUserDto): Promise<FormatLogin> {
        
        const user = await prisma.user.findFirst({
            where: { email: email }
        });
        
        const areEqual = await compare(password, user.password);
        if (!areEqual || !user) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        const {password: p, ...rest} = user;
        return rest;
    }

    async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {id}
        });
        const areEqual = await compare(payload.oldPassword, user.password);
        if (!areEqual || !user) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        return await prisma.user.update({
            where: {id},
            data: {password:  await hash(payload.newPassword, 10)}
        });
    }

    async transformUserTYpe(userType: string): Promise<UserType>{
        switch(userType.toUpperCase()){
            case UserType.CANDIDATE:
                return UserType.CANDIDATE;
            default:
                return UserType.RECRUITER;
        }
    }

}
