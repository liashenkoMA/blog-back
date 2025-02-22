import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/User/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email }).exec();

    if (!user) {
      throw new UnauthorizedException('Пользователя не существует');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Почта или пароль не верные');
    }

    const payload = { sub: user._id, username: user.email };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      access_token: jwt,
      name: user.name,
      familyName: user.familyName,
      avatarLink: user.avatarLink,
      telegram: user.telegram,
      vk: user.vk,
      gitHub: user.gitHub,
      linkedin: user.linkedin,
      mySite: user.mySite,
      city: user.city,
      yearFooter: user.yearFooter,
    };
  }
}
