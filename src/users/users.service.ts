import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
}
