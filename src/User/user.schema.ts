import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  familyName: string;

  @Prop()
  avatarLink: string;

  @Prop()
  telegram: string;

  @Prop()
  vk: string;

  @Prop()
  gitHub: string;

  @Prop()
  linkedin: string;

  @Prop()
  mySite: string;

  @Prop()
  city: string;

  @Prop()
  yearFooter: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
