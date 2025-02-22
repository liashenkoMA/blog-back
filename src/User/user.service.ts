import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user) {
    const oldUser = await this.userModel.findOne({ email: user.email }).exec();

    console.log(user);

    if (oldUser) {
      throw new ConflictException('Почта уже используется');
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    const createUser = new this.userModel({
      email: user.email,
      password: password,
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
    });

    return createUser.save();
  }
}
