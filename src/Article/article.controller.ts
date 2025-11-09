import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get('categories/:slug')
  async getCategory(@Param('slug') slug: string) {
    return this.articleService.getCategory(slug);
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

  @Get('tags/:slug')
  async getTag(@Param('slug') slug: string) {
    return this.articleService.getTag(slug);
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

  @Get('last')
  async getLastArticles() {
    return this.articleService.getLastArticles();
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string) {
    return this.articleService.getArticle(slug);
  }

  @Get()
  async getBlogQueryArticles(@Query('page') page: number) {
    return this.articleService.getBlogQueryArticles(page);
  }

  @Get('categoryarticles/:slug')
  async getCategoryArticles(
    @Param('slug') slug: string,
    @Query('page') page: number,
  ) {
    return this.articleService.getCategoryArticles(slug, page);
  }

  @Get('tagsarticles/:slug')
  async getTagArticles(
    @Param('slug') slug: string,
    @Query('page') page: number,
  ) {
    return this.articleService.getTagArticles(slug, page);
  }
}
