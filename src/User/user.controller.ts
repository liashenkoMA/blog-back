import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.schema.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  getUser() {
    return this.userService.getUser();
  }

  @Patch('update')
  patchUser(@Body() user: UserDto) {
    return this.userService.updateUser(user);
  }
}
