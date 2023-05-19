import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User, UserDocument } from "../../entities/user.entity";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { IJwtPayload } from "../../interfaces/ijwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userModel.findById(payload.id);

    if (user === null || user.email !== payload.email) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

export const jwtConstants = {
  secret: "aO3JXlqfDhFFU7XN53G6f60PGOsi/w7ESjmE1iVAgwE=",
};
