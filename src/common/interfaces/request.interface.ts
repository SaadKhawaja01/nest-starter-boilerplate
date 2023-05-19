import { Request } from "express";
import { UserDocument } from "src/user/entities/user.entity";

export interface UserRequest extends Request {
  user: UserDocument;
}
