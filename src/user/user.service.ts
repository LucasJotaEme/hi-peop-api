import { Injectable } from '@nestjs/common';
import { PrismaClient,User } from '@prisma/client';
import { UserDto } from './dto/user.dto';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
    
    async create(user: UserDto): Promise<User> {
        return await prisma.user.create({ data: user });
    }
}
