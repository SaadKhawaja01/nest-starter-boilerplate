import * as cacheManager from "cache-manager";

import { forwardRef, Module } from "@nestjs/common";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [StripeController],
  providers: [
    StripeService,
    {
      provide: "STRIPE_CACHE",
      useFactory: () => cacheManager.caching("memory", { ttl: 60 * 60 * 24 }),
    },
  ],
  exports: [StripeService],
})
export class StripeModule {}
