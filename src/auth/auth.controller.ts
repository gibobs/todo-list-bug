import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './is-public.decorator';
import { SignInDto } from './dto/sing-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body(ValidationPipe) signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.pass);
    }
}
