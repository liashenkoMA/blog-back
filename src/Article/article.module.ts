import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Article,
  ArticleSchema,
  Category,
  CategorySchema,
  Tag,
  TagSchema,
} from './article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class AtricleModule {}
