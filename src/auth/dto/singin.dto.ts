import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
    @IsEmail({}, { message: 'email must be a valid email' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @IsString({ message: 'pass must be a string' })
    @IsNotEmpty({ message: 'pass is required' })
    pass: string;
}
