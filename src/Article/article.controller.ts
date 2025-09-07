import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDTO, CategoryDTO, TagDTO } from './article.schema.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // === CATEGORY ===

  @Post('categories')
  async createCategory(@Body() category: CategoryDTO) {
    return this.articleService.postCategory(category);
  }

  @Get('categories')
  async getCategories() {
    return this.articleService.getCategories();
  }

  // === TAG ===

  @Post('tags')
  async createTag(@Body() tag: TagDTO) {
    return this.articleService.postTag(tag);
  }

  @Get('tags')
  async getTags() {
    return this.articleService.getTags();
  }

  // === ARTICLE ===

  @Post()
  async createArticle(@Body() article: ArticleDTO) {
    return this.articleService.postArticle(article);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string) {
    return this.articleService.getArticle(slug);
  }

    @Get()
  async getArticles() {
    return this.articleService.getArticles();
  }
}
