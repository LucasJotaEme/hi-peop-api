import { User } from "@prisma/client";
import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UserDto implements User {

    id: number
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;
}