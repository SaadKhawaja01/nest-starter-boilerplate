import * as cacheManager from "cache-manager";

import { CardDto } from "./dto/card.dto";
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PlanDto } from "./dto/plan.dto";
import Stripe from "stripe";
import { UserDocument } from "src/user/entities/user.entity";

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    @Inject("STRIPE_CACHE") private readonly cacheMem: cacheManager.Cache,
  ) {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY ||
        "sk_test_51HMRYuGtg8qqmpflFzOG4AErt1JrFoO50F1ymI4KE8GDOuRRyfqIBovFF91NYAJQIOBwtQtFfkD857UJNW9em1np00sojUbFCX",
      {
        apiVersion: "2022-11-15",
      },
    );
  }

  async ensureCustomerCreated(user: UserDocument) {
    let customer = (await this.stripe.customers.list({ email: user.email }))
      .data[0];
    if (!customer) {
      customer = await this.stripe.customers.create({ email: user.email });
    }

    user.stripeCustomerId = customer.id;
    await user.save();

    return customer;
  }

  async fetchPaymentMethods(customerId: string) {
    const payments = (
      await this.stripe.customers.listPaymentMethods(customerId)
    ).data;

    const customers = await this.stripe.customers.list();
    const customer = customers.data.find(
      (customer) => customer.id === customerId,
    );
    const defaultPaymentMethodeId =
      customer.invoice_settings.default_payment_method;

    const otherPaymentMethods = payments.find(
      (payment) => payment.id != defaultPaymentMethodeId,
    );

    const defaultPaymentMethode = payments.find(
      (payment) => payment.id == defaultPaymentMethodeId,
    );

    return {
      ...otherPaymentMethods,
      defaultmethode: defaultPaymentMethode,
    };
  }

  async createPaymentMethod(customerId: string, card: CardDto) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: "card",
        card,
      });

      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });
      await this.setDefaultPaymentMethod(customerId, paymentMethod.id);
      return paymentMethod;
    } catch (error) {
      throw new UnprocessableEntityException(error.raw.message);
    }
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId) {
    try {
      return await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error) {
      throw new UnprocessableEntityException(error.raw.message);
    }
  }

  async detachPaymentMethod(id: string) {
    return this.stripe.paymentMethods.detach(id);
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    return this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async fetchSubscriptions(customerId: string) {
    return (
      await this.stripe.subscriptions.list({
        customer: customerId,
      })
    ).data;
  }

  async createSubscription(customerId: string, planId: string) {
    try {
      return await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            plan: planId,
          },
        ],
      });
    } catch (error) {
      throw new UnprocessableEntityException(error.raw.message);
    }
  }

  async retriveSubscriptions(customerId: string) {
    try {
      const cacheKey = `subscription_${customerId}`;
      let subscription: any = await this.cacheMem.get(cacheKey);

      // get from stripe server because not in local cache of hexa server
      if (!subscription) {
        const subscriptions = await this.stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        });
        subscription = subscriptions.data[0];
        // fresh subscription data from stripe server and save it in local cache of hexa server
        await this.cacheMem.set(cacheKey, subscription);
      }
      return subscription;
    } catch (error) {
      return null;
    }
  }

  async fetchPlans() {
    const products = await this.stripe.products.list();
    const plans = await this.stripe.prices.list({
      product: products.data.filter((product) => product.name === "Hexa")[0].id,
    });
    return plans.data.map((plan) => {
      const response: PlanDto = {
        id: plan.id,
        name: plan.metadata.name,
        amount: plan.unit_amount / 100,
        currency: plan.currency,
        interval: plan.recurring.interval,
      };
      return response;
    });
  }
}
