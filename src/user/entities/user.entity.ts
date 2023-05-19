import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ForbiddenException } from "@nestjs/common";
import { Role } from "../enums/role.enum";
import { SecretHash } from "../interfaces/secret-hash.interface";
import { UserDto } from "../dto/user.dto";

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: User) => {
      const dto: UserDto = {
        avatar: ret.avatar,
        email: ret.email,
        emailVerifiedAt: ret.emailVerifiedAt,
        name: ret.name,
        role: ret.role,
      };
      return dto;
    },
  },
})
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ default: "https://www.gravatar.com/avatar/?d=identicon" })
  avatar: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  tempEmail: string;

  @Prop()
  name: string;

  @Prop({ default: Role.User })
  role: Role;

  @Prop()
  password: string;

  @Prop()
  secrets: SecretHash[];

  @Prop()
  emailVerifiedAt: Date;

  @Prop()
  stripeCustomerId: string;

  authorize: <R>(
    can: (user: User, resource?: R) => Promise<boolean>,
    resource?: R,
  ) => Promise<void>;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.authorize = async function <R>(
  can: (user: User, resource?: R) => Promise<boolean>,
  resource?: R,
) {
  const allowed = await can(this, resource);
  if (!allowed) {
    throw new ForbiddenException("You are not allowed to perform this action");
  }
};
