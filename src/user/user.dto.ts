import { userType, user } from "@prisma/client";
import { IsEmail, IsInt, IsNotEmpty, IsString, IsOptional, IsEmpty, IsIn, IsEnum, max, Max, IsPositive, IsNumber } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateUserDto {

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

    password: string;

    @IsIn(["recruiter", "candidate"])
    userType: userType;

    createdAt: Date;
    updatedAt: Date;
}

export class UpdateUserDto {

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

    @IsIn(["recruiter", "candidate"])
    userType: userType;

    createdAt: Date;
    updatedAt: Date;
}

export class DeleteUserDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
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
    email: string;
}

export class UserPagerDto {

    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    @IsIn(["recruiter", "candidate"])
    userType: userType;

    @IsString()
    @IsOptional()
    @IsIn(["id", "email", "type"])
    orderBy: string;

    @IsString()
    @IsOptional()
    @IsIn(["asc", "desc"])
    order: string;

    @IsOptional()
    count?: string;

    @IsOptional()
    page?: string;
}