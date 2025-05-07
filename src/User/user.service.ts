import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.schema.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: UserDto) {
    const oldUser = await this.userModel.findOne({ email: user.email }).exec();

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
  
  async getUser() {
    const user = await this.userModel.find({ email: process.env.EMAIL }).exec();

    return {
      name: user[0].name,
      email:user[0].email,
      familyName: user[0].familyName,
      avatarLink: user[0].avatarLink,
      telegram: user[0].telegram,
      vk: user[0].vk,
      gitHub: user[0].gitHub,
      linkedin: user[0].linkedin,
      mySite: user[0].mySite,
      city: user[0].city,
      yearFooter: user[0].yearFooter,
    };
  }

  async updateUser(userData: UserDto) {
    const user = await this.userModel
      .findOne({ email: process.env.EMAIL })
      .exec();

    return this.userModel.updateOne(
      { email: process.env.EMAIL },
      {
        $set: {
          avatarLink: userData.avatarLink,
          telegram: userData.telegram,
          vk: userData.vk,
          gitHub: userData.gitHub,
          linkedin: userData.linkedin,
          city: userData.city,
          yearFooter: userData.yearFooter,
        },
      },
    );
  }
}
