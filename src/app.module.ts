import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { FileModule } from './File/file.module';
import { AtricleModule } from './Article/article.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/'),
    UserModule,
    AuthModule,
    FileModule,
    AtricleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
