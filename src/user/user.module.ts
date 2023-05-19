import { jwtConstants, JwtGuard, JwtStrategy } from "./guards/jwt/jwt.guard";
import { User, UserSchema } from "./entities/user.entity";

import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "src/mailer/mailer.module";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ImageKitModule } from "src/image-kit/image-kit.module";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || jwtConstants.secret,
        signOptions: { expiresIn: "24h" },
      }),
    }),
    MailerModule,
    ImageKitModule,
    forwardRef(() => StripeModule),
  ],
  controllers: [UserController],
  providers: [JwtStrategy, JwtGuard, UserService],
  exports: [JwtGuard, UserService],
})
export class UserModule {}
