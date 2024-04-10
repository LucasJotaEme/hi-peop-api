import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient,user, userType } from '@prisma/client';
import {compare, hash} from 'bcrypt'
import { CreateUserDto, FindUserDto, UpdatePasswordDto, UpdateUserDto } from './user.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { LoginUserDto } from 'src/auth/auth.dto';

const prisma = new PrismaClient();

interface FormatLogin extends Partial<user> {
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

    async find(payload: FindUserDto | JwtPayload): Promise<user> {
        
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

        await this.validateUserPassword(user, password);

        const {password: p, ...rest} = user;
        return rest;
    }

    async updatePassword(payload: UpdatePasswordDto, id: number): Promise<user> {
        
        const user = await prisma.user.findUnique({
            where: {id}
        });

        await this.validateUserPassword(user, payload.oldPassword);

        return await prisma.user.update({
            where: {id},
            data: {password:  await hash(payload.newPassword, 10)}
        });
    }

    async validateUserPassword(user : user, password : string){
        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        const areEqual = await compare(password, user.password);
        
        if (!areEqual) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    async transformUserTYpe(dateUserType: string): Promise<userType>{
        switch(dateUserType.toUpperCase()){
            case userType.CANDIDATE:
                return userType.CANDIDATE;
            default:
                return userType.RECRUITER;
        }
    }

}
