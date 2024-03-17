import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsString()
    @IsEmail({}, {message: "Email is not valid"})
    email: string;
}
