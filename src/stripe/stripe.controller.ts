import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { PlanDto } from "./dto/plan.dto";
import { StripeService } from "./stripe.service";
import { JwtGuard } from "../user/guards/jwt/jwt.guard";
import { UserRequest } from "../common/interfaces/request.interface";
import { SubscriptionDto } from "./dto/subscription.dto";
import { CardDto } from "./dto/card.dto";

@ApiTags("Payment")
@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiResponse({ type: SubscriptionDto, isArray: true })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("subscriptions")
  async getSubscriptions(@Req() { user }: UserRequest) {
    return this.stripeService.fetchSubscriptions(user.stripeCustomerId);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post("subscriptions")
  async createSubscription(
    @Body() body: CreateSubscriptionDto,
    @Req() { user }: UserRequest,
  ) {
    return this.stripeService.createSubscription(
      user.stripeCustomerId,
      body.planId,
    );
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("payment-methods")
  async getPaymentMethods(@Req() { user }: UserRequest) {
    await this.stripeService.ensureCustomerCreated(user);
    return await this.stripeService.fetchPaymentMethods(user.stripeCustomerId);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get("payment-methods/:id/set-as-default")
  async setDefaultPaymentMethod(
    @Param("id") id: string,
    @Req() { user }: UserRequest,
  ) {
    return this.stripeService.setDefaultPaymentMethod(
      user.stripeCustomerId,
      id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post("payment-methods")
  async createPaymentMethod(
    @Body() body: CardDto,
    @Req() { user }: UserRequest,
  ) {
    return this.stripeService.createPaymentMethod(user.stripeCustomerId, body);
  }

  @ApiResponse({ type: PlanDto, status: 200 })
  @Get("/plans")
  getPlans() {
    return this.stripeService.fetchPlans();
  }
}
