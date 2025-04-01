import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);

        if (!user) {
            this.logger.log(`User with email ${email} not found`);
            throw new UnauthorizedException(['user or pass incorrect']);
        }

        if (user?.pass !== pass) {
            this.logger.log(`Invalid password for user with email ${email}`);
            throw new UnauthorizedException(['user or pass incorrect']);
        }

        const payload = { id: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
            }),
        };
    }
}
