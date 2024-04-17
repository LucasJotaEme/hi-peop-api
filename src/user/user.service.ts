import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient,user, userType } from '@prisma/client';
import {compare, hash} from 'bcrypt'
import { CreateUserDto, DeleteUserDto, FindUserDto, UpdatePasswordDto, UpdateUserDto, UserPagerDto } from './user.dto';
import { JwtPayload } from 'src/auth/jwt.strategy';
import { LoginUserDto } from 'src/auth/auth.dto';

const prisma = new PrismaClient();

interface FormatLogin extends Partial<user> {
    email: string
}
@Injectable()
export class UserService {
    
    async create(createUserDto : CreateUserDto): Promise<any> {
        const existingUser = await prisma.user.findUnique({where: {email: createUserDto.email}});
        if(existingUser){
            const userIsDeleted = existingUser.isDeleted === null ? false : existingUser.isDeleted;
            if(!userIsDeleted){
                throw new ConflictException(`Email no válido`);
            }
        }

        const where = {where: {email: createUserDto.email}};
        
        return await prisma.user.upsert({
            ...where,
            create: {
                ...createUserDto,
                userType: await this.transformUserTYpe(createUserDto.userType),
                password: await hash(createUserDto.password, 10),
                isDeleted: false
            },update: {
                ...createUserDto,
                userType: await this.transformUserTYpe(createUserDto.userType),
                password: await hash(createUserDto.password, 10),
                isDeleted: false
            }
            
        });
    }

    async update(updateUserDto : UpdateUserDto): Promise<any> {
        const where = {where: {email: updateUserDto.email, isDeleted: false}};
        const existingUser = await prisma.user.findUnique(where);
        
        if(!existingUser){
            throw new NotFoundException();
        }

        return await prisma.user.update({
            ...where,
            data: {
                ...updateUserDto,
                userType: await this.transformUserTYpe(updateUserDto.userType),
            }
        });
    }

    async delete(deleteUserDto : DeleteUserDto): Promise<any> {
        const where = {where: {email: deleteUserDto.email, isDeleted: false}};
        const existingUser = await prisma.user.findUnique(where);
        
        if(!existingUser){
            throw new NotFoundException();
        }
        
        return await prisma.user.update({
            ...where,
            data: {
                ...deleteUserDto,
                isDeleted: true,
                deletedAt: new Date()
            }
        });
    }

    async find(payload: FindUserDto | JwtPayload): Promise<user> {
        const user = await prisma.user.findFirst({
            where: {email: payload.email}
        })

        if(!user){
            throw new NotFoundException();
        }
        return user;
    }

    async findUsers(payload: UserPagerDto): Promise<any>{

        let whereCondition: any = {};
        
        if (payload.id !== undefined)
            whereCondition.id = parseInt(payload.id);

        if (payload.name !== undefined){
            const nameParts = payload.name.split(' ').filter(part => part.trim() !== '');
            whereCondition.OR = nameParts.map(part => ({
                OR: [
                    { firstName: { contains: part } },
                    { lastName: { contains: part } }
                ]
            }));
        }
        
        if (payload.userType !== undefined)
            whereCondition.userType = await this.transformUserTYpe(payload.userType);

        const count = parseInt(payload.count, 10);
        const page = parseInt(payload.page, 10);
        const {skip, take} = await this.getSkipAndTake(count, page);
        

        const items = await prisma.user.findMany({
            where: whereCondition,
            skip: skip,
            take: take,
            orderBy: await this.getOrderObject(payload.orderBy, payload.order)
        });
        const totalCount = await prisma.user.count({ where: whereCondition });

        const currentPage = page || 1;

        return {items, count, totalCount, currentPage};
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
            throw new HttpException("Las credenciales ingresadas no son válidas. Por favor, verifique su correo electrónico y contraseña e inténtelo de nuevo.", HttpStatus.UNAUTHORIZED);
        }
        const areEqual = await compare(password, user.password);
        
        if (!areEqual) {
            throw new HttpException("Contraseña no válida", HttpStatus.BAD_REQUEST);
        }
    }

    async transformUserTYpe(dataUserType: string): Promise<userType>{
        
        switch(dataUserType.toUpperCase()){
            case userType.CANDIDATE:
                return userType.CANDIDATE;
            default:
                return userType.RECRUITER;
        }
    }

    async getOrderObject(orderBy: string, order:  string): Promise<object>{
        let orderObject: any = {};

        if(orderBy === undefined)
            orderBy = "id";

        if(order === undefined)
            order = "asc";

        orderObject[orderBy] = order;

        return orderObject;
    }

    async getSkipAndTake(take: number, skip: number):  Promise<pager>{
        let pager: any = {};

        if(Number.isNaN(skip) || skip === 0){
            skip = 0;
        }else{
            skip -= 1;
        }
        if(Number.isNaN(take) || take === 0){
            take = 1;
        }
        pager.skip = skip * take;
        pager.take = take;

        return pager;
    }

}

export interface pager {
    skip: number;
    take: number;
}
