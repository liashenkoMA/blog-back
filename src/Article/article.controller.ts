import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDTO } from './article.schema.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async postArticle(@Body() article: ArticleDTO) {
    return await this.articleService.postArticle(article);
  }

  @Get('all_categories')
  async getArticleCategories() {
    return await this.articleService.getArticleCategories();
  }

  @Get('getarticle')
  async getArticles() {
    return await this.articleService.getArticles();
  }

  @Get('getarticle/:id')
  async getArticle(@Param('id') id: string) {
    return await this.articleService.getArticle(id);
  }
}
