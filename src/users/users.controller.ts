import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user-dto';
import { UpdateUserDto } from './update-user-dto';

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

    //****************************************** */
    /// controlador que mostrará los datos del propio usuario
    // encontrará un usuario a través del email
    @Post('/find-me')
    //he preferido usar un método POST para evitar problemas de caché
    @UseGuards(AuthGuard)
    async findMe(@Body('email') email: string) {
        //comprobamos que el email sea correcto
        if (!email) {
            return {
                error: 'Invalid Email',
                message: 'Email is required to find you.',
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
    //************************************************* */
    /// controlador para actualizar datos de un
    // encontramos al usuario a traves del email
    @Put('/update-me')
    @UseGuards(AuthGuard)
    async update(
        @Body() newBody: UpdateUserDto,
        @Body('previousEmail') previousEmail: string,
    ) {
        try {
            //validamos que los datos no sean nulos
            if (!newBody || !previousEmail) {
                return {
                    error: 'Invalid Input',
                    message:
                        'Both user data and previous email are required to update.',
                };
            }

            // Invocamos el servicio para actualizar el usuario
            const updatedUser = await this.usersService.updateMe(
                previousEmail,
                newBody,
            );
            return {
                status: 'success',
                data: updatedUser,
            };
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                error: 'Error Updating User',
                message:
                    'An unexpected error occurred while updating the user. Please try again later.',
            };
        }
    }

    @Delete('/delete-me')
    @UseGuards(AuthGuard)
    async deleteMe(@Body('email') email: string) {
        //validamos que el email no sea nulo
        if (!email) {
            return {
                error: 'Invalid Email',
                message: 'Email is required to find you.',
            };
        }
        try {
            //invocamos el servicio para eliminar al usuario
            return await this.usersService.deleteMe(email);
        } catch (_error) {
            return {
                error: 'Error deleting user. Try again please',
                message:
                    'An unexpected error occurred. Please try again later.',
            };
        }
    }
}
