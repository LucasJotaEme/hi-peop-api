import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async create(user:UserDto): Promise<User>{
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }
}
