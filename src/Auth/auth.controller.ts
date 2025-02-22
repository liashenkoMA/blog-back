import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/User/user.schema.dto';

@Controller('auth')
export class AuthController {
  constructor(private authServise: AuthService) {}

  @Post('signin')
  async signIn(@Body() user: UserDto) {
    const { email, password } = user;
    const res = await this.authServise.signIn(email, password);
    return res;
  }
}
