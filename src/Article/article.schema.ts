import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true, unique: true })
  categorySlug: string;

  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true })
  categoryImage: string;

  @Prop({ required: true })
  categoryImageAlt: string;

  @Prop({ required: true })
  categoryTitle: string;

  @Prop({ required: true })
  categoryDescription: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  tagSlug: string;

  @Prop({ required: true })
  tagName: string;

  @Prop({ required: true })
  tagImage: string;

  @Prop({ required: true })
  tagImageAlt: string;

  @Prop({ required: true })
  tagTitle: string;

  @Prop({ required: true })
  tagDescription: string;
}
export const TagSchema = SchemaFactory.createForClass(Tag);

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true, unique: true })
  articleSlug: string;

  @Prop({ required: true })
  articleTitle: string;

  @Prop({ required: true })
  articleDescription: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  articleCategory: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  articleTags: Types.ObjectId[];

  @Prop({ required: true })
  articleImg: string;

  @Prop({ required: true })
  articleImgAlt: string;

  @Prop({ required: true })
  articleH1: string;

  @Prop({ required: true })
  article: string;

  @Prop({ required: true })
  articleReadingTime: number;
}
export const ArticleSchema = SchemaFactory.createForClass(Article);
