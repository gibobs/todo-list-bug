import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user-dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    async create(@Body() body: CreateUserDto) {
        //validamos la entrada de datos
        try {
            //invocamos el servicio para crear usuarios
            return await this.usersService.create(body);
        } catch (_error) {
            return {
                error: 'User already exists',
                message:
                    'The email address provided is already associated with an existing account. Please use a different email.',
            };
        }
    }

    @Post('/find-me')
    //he preferido usar un método POST para evitar problemas de caché
    @UseGuards(AuthGuard)
    async findMe(@Body('email') email: string) {
        //comprobamos que el
        if (!email) {
            return {
                error: 'Invalid Input',
                message: 'Email is required to find a user.',
            };
        }
        try {
            //invocamos el servicio para buscar usuario q
            return await this.usersService.findOne(email);
        } catch (_error) {
            return {
                error: 'Error finding user',
                message:
                    'An unexpected error occurred. Please try again later.',
            };
        }
    }
}
