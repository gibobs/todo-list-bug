import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(body: any) {
        //verificamos si el usuario existe previamente:
        const existingUser = await this.usersRepository.findOneBy({
            email: body.email,
        });
        if (existingUser) {
            throw new BadRequestException('Email is already in use.');
        }

        //creamos el nuevo usuario
        const user = new User();
        user.email = body.email;
        user.pass = body.password;
        user.fullname = body.fullname;

        await this.usersRepository.save(user);
        return user;
    }

    async findOne(email: string) {
        // Validamos que el email no sea nulo o vacío
        if (!email) {
            throw new BadRequestException(
                'Email is required. Please provide an email address.',
            );
        }
        // Buscamos el usuario en la base de datos
        const user = await this.usersRepository.findOneBy({ email });
        console.log('User found:', user);
        if (!user) {
            throw new NotFoundException(
                'No user found with the provided email address. Try again please.',
            );
        }
        // Devolvemos el usuario encontrado
        return user;
    }

    async updateMe(previousEmail: string, newBody: any) {
        //comprobamsos que el email no sea nulo
        if (!previousEmail) {
            throw new BadRequestException(
                'Previous email is required to update the user.',
            );
        }
        if (!newBody) {
            throw new BadRequestException(
                'New body is required to update the user.',
            );
        }

        //buscamos al usuario en la base de datos
        const user = await this.usersRepository.findOneBy({
            email: previousEmail,
        });
        //verificamos si el usuario existe
        if (!user) {
            throw new NotFoundException(
                'User not found with the provided email address.',
            );
        }

        // Actualizamos solo los campos proporcionados
        if (newBody.email) {
            user.email = newBody.email;
        }
        if (newBody.password) {
            // Encripta la contraseña antes de guardarla
            const salt = await bcrypt.genSalt();
            user.pass = await bcrypt.hash(newBody.password, salt);
        }
        if (newBody.fullname) {
            user.fullname = newBody.fullname;
        }

        // Guardamos los cambios en la base de datos
        const updatedUser = await this.usersRepository.save(user);
        return updatedUser;
    }

    async deleteMe(email: string) {
        try {
            //validamos que el email no sea nulo
            if (!email) {
                return {
                    error: 'Invalid Email',
                    message: 'Email is required to find you.',
                };
            }
            //buscamos al usuario en la base de datos
            const user = await this.usersRepository.findOneBy({ email });
            //verificamos si el usuario existe
            if (!user) {
                return {
                    error: 'User not found',
                    statusCode: 404,
                    message:
                        'No user found with the provided email address. Try again please.',
                };
            }
            //eliminamos al usuario
            await this.usersRepository.delete({ email });
            this.logger.log(`User with email ${email} deleted successfully.`);
            // Verificamos si el usuario sigue existiendo
            const userAfterDelete = await this.usersRepository.findOneBy({
                email,
            });

            if (userAfterDelete) {
                this.logger.error(
                    `User still exists after delete: ${JSON.stringify(userAfterDelete)}`,
                );
                return {
                    error: 'Deletion Failed',
                    message: 'The user could not be deleted. Please try again.',
                };
            }
            return {
                status: 'success',
                message: 'User deleted successfully',
            };
        } catch (error) {
            this.logger.error('Error deleting user:', error);
            return {
                error: 'Error deleting user',
                message:
                    'An unexpected error occurred while deleting the user.',
            };
        }
    }
}
