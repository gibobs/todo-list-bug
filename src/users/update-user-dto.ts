import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @MaxLength(50, {
        message: 'Email is too long. Max length is 50 characters',
    })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Password must be a string' })
    @MaxLength(15, {
        message: 'Password is too long. Max length is 15 characters',
    })
    password?: string;

    @IsOptional()
    @IsString({ message: 'Full Name must be a string' })
    @MaxLength(50, {
        message: 'Full Name is too long. Max length is 50 characters',
    })
    fullname?: string;

    @IsOptional()
    @IsString({ message: 'Previous email must be a string' })
    previousEmail?: string;
}
