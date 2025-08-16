import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model } from 'mongoose';
import { ArticleDTO } from './article.schema.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
  ) {}

  async postArticle(article: ArticleDTO): Promise<Article> {
    const newArticle = new this.articleModel(article);
    return await newArticle.save();
  }

  async getArticleCategories(): Promise<string[]> {
    const articleCategories = await this.articleModel
      .distinct('category')
      .exec();

    return Array.isArray(articleCategories) ? articleCategories : [];
  }

  async getArticle(id: string): Promise<Article | null> {
    const article = await this.articleModel.findOne({ slug: id }).exec();
    return article;
  }

  async getArticles(): Promise<Article[]> {
    const articles = await this.articleModel.find().exec();
    return articles;
  }
}
