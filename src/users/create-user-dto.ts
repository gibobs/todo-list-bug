import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({
        message: 'Email is required, please',
    })
    @IsString()
    @MaxLength(50, {
        message: 'Email is too long. Max length is 50 characters',
    })
    email: string;

    @IsString()
    @MaxLength(15, {
        message: 'Password is too long. Max length is 15 characters',
    })
    @IsNotEmpty({
        message: 'Password is required, please',
    })
    password: string;

    @IsString()
    @IsNotEmpty({
        message: 'Fullname is required, please',
    })
    @MaxLength(50, {
        message: 'Full Name is too long. Max length is 50 characters',
    })
    fullname: string;
}
