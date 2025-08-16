import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article extends Document {
  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  articleImg: string;

  @Prop({ required: true })
  articleImgAlt: string;

  @Prop({ required: true })
  articleH1: string;

  @Prop({ required: true })
  article: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
