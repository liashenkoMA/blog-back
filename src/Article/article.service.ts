import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, Category, Tag } from './article.schema';
import { Model, Types } from 'mongoose';
import { ArticleDTO, CategoryDTO, TagDTO } from './article.schema.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Tag.name) private readonly tagModel: Model<Tag>,
  ) {}

  // === CATEGORY ===

  async postCategory(category: CategoryDTO): Promise<Category> {
    try {
      const newCategory = new this.categoryModel(category);
      return newCategory.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Ошибка при создании категории: ${error.message}`,
      );
    }
  }

  async getCategory(slug: string): Promise<Category> {
    try {
      const category = await this.categoryModel
        .findOne({ categorySlug: slug })
        .exec();

      if (!category) {
        throw new NotFoundException(`Категория с slug "${slug}" не найдена`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении категории: ${error.message}`,
      );
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  // === TAG ===

  async postTag(tag: TagDTO): Promise<Tag> {
    try {
      const newTag = new this.tagModel(tag);
      return newTag.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Ошибка при создании тэга: ${error.message}`,
      );
    }
  }

  async getTag(slug: string): Promise<Tag> {
    try {
      const tag = await this.tagModel.findOne({ tagSlug: slug }).exec();

      if (!tag) {
        throw new NotFoundException(`Тэг со slug "${slug}" не найден`);
      }

      return tag;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при создании тэга: ${error.message}`,
      );
    }
  }

  async getTags(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  // === ARTICLE ===

  async postArticle(article: ArticleDTO): Promise<Article> {
    try {
      // === category ===

      let categoryId: Types.ObjectId;

      if (typeof article.articleCategory === 'string') {
        const category = await this.categoryModel.findOne({
          _id: article.articleCategory,
        });

        if (!category) {
          throw new NotFoundException(
            `Category ${article.articleCategory} not found`,
          );
        }
        categoryId = category._id as Types.ObjectId;
      } else {
        let category = await this.categoryModel.findOne({
          categorySlug: article.articleCategory.categorySlug,
        });

        if (!category) {
          category = new this.categoryModel(article.articleCategory);
          await category.save();
        }
        categoryId = category._id as Types.ObjectId;
      }

      // === tag ===

      const tagIds: Types.ObjectId[] = [];

      for (const tag of article.articleTags) {
        if (typeof tag === 'string') {
          const existingTag = await this.tagModel.findOne({ _id: tag });

          if (existingTag) {
            tagIds.push(existingTag._id as Types.ObjectId);
          } else {
            throw new NotFoundException(`Tag ${tag} not found`);
          }
        } else {
          let existingTag = await this.tagModel.findOne({
            tagSlug: tag.tagSlug,
          });

          if (!existingTag) {
            existingTag = new this.tagModel(tag);
            await existingTag.save();
          }

          tagIds.push(existingTag._id as Types.ObjectId);
        }
      }

      // === reading Time ===

      const words = article.article.split(/\s+/).length;
      const wordsPerMinut = 160;
      const articleReadingTime = Math.ceil(words / wordsPerMinut);

      // === article ===

      const newArticle = new this.articleModel({
        articleSlug: article.articleSlug,
        articleTitle: article.articleTitle,
        articleDescription: article.articleDescription,
        articleCategory: categoryId,
        articleTags: tagIds,
        articleImg: article.articleImg,
        articleImgAlt: article.articleImgAlt,
        articleH1: article.articleH1,
        article: article.article,
        articleReadingTime,
      });

      return await newArticle.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при создании статьи: ${error.message}`,
      );
    }
  }

  async getArticle(slug: string): Promise<Article> {
    try {
      const article = await this.articleModel
        .findOne({ articleSlug: slug })
        .populate('articleCategory')
        .populate({ path: 'articleTags', model: 'Tag' })
        .exec();

      if (!article) {
        throw new NotFoundException(`Статья с slug "${slug}" не найдена`);
      }

      return article;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении статьи: ${error.message}`,
      );
    }
  }

  async getAllArticles(): Promise<{ articles: Article[]; totalCount: number }> {
    try {
      const articles = await this.articleModel
        .find()
        .populate('articleCategory')
        .populate({ path: 'articleTags', model: 'Tag' })
        .sort({ createdAt: -1 })
        .exec();

      const totalCount = await this.articleModel.countDocuments().exec();

      if (!articles || articles.length === 0) {
        throw new NotFoundException('Статьи не найдены');
      }

      return { articles, totalCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении статей: ${error.message}`,
      );
    }
  }

  async getBlogQueryArticles(page: number): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    try {
      const limit = 6;
      const skip = (page - 1) * limit;

      const articles = await this.articleModel
        .find()
        .populate('articleCategory')
        .populate({ path: 'articleTags', model: 'Tag' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const totalCount = await this.articleModel.countDocuments().exec();

      if (!articles || articles.length === 0) {
        throw new NotFoundException('Статьи не найдены');
      }

      return { articles, totalCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении статей: ${error.message}`,
      );
    }
  }

  async getLastArticles() {
    try {
      const lastArticles = await this.articleModel
        .find()
        .populate('articleCategory')
        .sort({ createdAt: -1 })
        .limit(4)
        .exec();

      if (!lastArticles || lastArticles.length === 0) {
        throw new NotFoundException('Опубликованные статьи не найдены');
      }

      return lastArticles;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении статей: ${error.message}`,
      );
    }
  }

  async getCategoryArticles(
    slug: string,
    page: number,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    try {
      const category = await this.categoryModel
        .findOne({ categorySlug: slug })
        .exec();

      if (!category) {
        throw new NotFoundException(`Категория со slug "${slug}" не найдена`);
      }

      const limit = 6;
      const skip = (page - 1) * limit;

      const articles = await this.articleModel
        .find({ articleCategory: category._id })
        .populate('articleCategory')
        .populate({ path: 'articleTags', model: 'Tag' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();

      const totalCount = await this.articleModel
        .countDocuments({ articleCategory: category._id })
        .exec();

      if (!articles || articles.length === 0) {
        throw new NotFoundException('Статьи не найдены');
      }

      return { articles, totalCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении статей: ${error.message}`,
      );
    }
  }

  async getTagArticles(
    slug: string,
    page: number,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    try {
      const tag = await this.tagModel.findOne({ tagSlug: slug }).exec();

      if (!tag) {
        throw new NotFoundException(`Тэг со slug "${slug}" не найден`);
      }

      const limit = 6;
      const skip = (page - 1) * limit;

      const articles = await this.articleModel
        .find({ articleTags: tag._id })
        .populate('articleCategory')
        .populate({ path: 'articleTags', model: 'Tag' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();

      const totalCount = await this.articleModel
        .countDocuments({ articleTags: tag._id })
        .exec();

      if (!articles || articles.length === 0) {
        throw new NotFoundException(`Статьи с тэгом "${slug}" не найдены`);
      }

      return { articles, totalCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при получении статей: ${error.message}`,
      );
    }
  }
}
