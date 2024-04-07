import { UserType, User } from "@prisma/client";
import { IsEmail, IsInt, IsNotEmpty, IsString, IsOptional, IsEmpty, IsIn, IsEnum } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateUserDto implements User {

    @IsOptional()
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

    login: string;
    password: string;

    @IsIn(["recruiter", "candidate"])
    userType: UserType;

    createdAt: Date;
    updatedAt: Date;
}

export class UpdatePasswordDto {

    @IsNotEmpty()
    @ApiProperty() newPassword: string;

    @IsNotEmpty()
    @ApiProperty() oldPassword: string;

}

export class FindUserDto {

    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsEmpty()
    @IsOptional()
    password: string;
}