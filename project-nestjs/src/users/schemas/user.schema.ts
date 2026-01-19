import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: false, trim: true, unique: true, sparse: true })
  email?: string;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  provider?: string;

  @Prop({ required: false })
  username?: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false, default: true })
  isActive?: boolean;

  @Prop({ required: false })
  lastLogin?: Date;

  // Instance methods
  getAvatarUrl(req: any): string | null {
    if (!this.avatar) return null;
    return `${req.protocol}://${req.get('host')}/uploads/avatars/${this.avatar}`;
  }

  toJSON(): any {
    const user = this.toObject();
    delete user.password;
    delete user.refreshTokens;
    return user;
  }

  toObject(): any {
    return {
      _id: (this as any)._id,
      name: this.name,
      email: this.email,
      username: this.username,
      avatar: this.avatar,
      provider: this.provider,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      googleId: this.googleId
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Static methods
UserSchema.statics.findByRefreshToken = function(token: string) {
  return this.findOne({ 'refreshTokens.token': token });
};