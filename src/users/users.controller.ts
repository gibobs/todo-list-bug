import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user-dto';
import { UpdateUserDto } from './update-user-dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    //****************************************** */

    @Post('/create')
    async create(@Body() body: CreateUserDto) {
        try {
            // Validamos que el cuerpo de la solicitud no esté vacío
            if (!body || !body.email) {
                throw new BadRequestException(
                    'Request body or email is required.',
                );
            }

            // Invocamos el servicio para crear el usuario
            const newUser = await this.usersService.create(body);

            // Devolvemos una respuesta exitosa
            return {
                statusCode: 201,
                data: newUser,
                message: 'User created successfully.',
            };
        } catch (error) {
            console.error('Error creating user:', error);

            // Si  usuario ya existe en la bdd
            if (error.message === 'User already exists') {
                throw new ConflictException(
                    'The email address provided is already associated with an existing account. Please use a different email.',
                );
            }

            // Para otros errores, lanzamos una excepción genérica
            throw new InternalServerErrorException(
                'An unexpected error occurred while creating the user. Try again lster, please.',
            );
        }
    }
    //****************************************** */
    /// controlador que mostrará los datos del propio usuario
    // a través del email
    //útil como consulta del propio usuario
    @Post('/find-me')
    //he preferido usar un método POST para evitar problemas de caché
    @UseGuards(AuthGuard)
    async findMe(@Body('email') email: string) {
        try {
            //comprobamos que el email sea correcto
            if (!email) {
                throw new BadRequestException(
                    'Request email is required. Try again, please.',
                );
            }

            //invocamos el servicio para buscar usuario
            const youFindMe = await this.usersService.findOne(email);

            // Verificamos si el usuario existe
            if (!youFindMe) {
                throw new NotFoundException(
                    'User with the provided email was not found.',
                );
            }

            // Devolvemos una respuesta exitosa
            return {
                status: 'success',
                data: youFindMe,
                message: 'User found successfully.',
            };
        } catch (error) {
            console.error('Error finding user:', error);

            // Si el error es una excepción conocida, la relanzamos
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
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
                throw new BadRequestException(
                    'Request email and new data are required. Try again, please.',
                );
            }
            // Validamos que los datos no sean nulos
            if (
                !newBody ||
                Object.keys(newBody).length === 0 ||
                !previousEmail
            ) {
                throw new BadRequestException(
                    'Request email and new data are required. Try again, please.',
                );
            }

            // Invocamos el servicio para actualizar el usuario
            const updatedUser = await this.usersService.updateMe(
                previousEmail,
                newBody,
            );
            // Devolvemos una respuesta exitosa

            return {
                status: 'success',
                data: updatedUser,
                message: 'User datsa updated successfully.',
            };
        } catch (error) {
            console.error('Error updating user:', error);

            // Si el error es una excepción conocida, la relanzamos
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
        }
    }
    //************************************************* */
    /// controlador para eliminar al usuario
    //  a través del email
    @Delete('/delete-me')
    @UseGuards(AuthGuard)
    async deleteMe(@Body('email') email: string) {
        //validamos que el email no sea nulo
        if (!email) {
            throw new BadRequestException(
                'Request email is required. Try again, please.',
            );
        }
        try {
            //invocamos el servicio para eliminar al usuario
            return await this.usersService.deleteMe(email);
        } catch (_error) {
            throw new InternalServerErrorException(
                'An unexpected error occurred. Please try again later.',
            );
        }
    }
}
