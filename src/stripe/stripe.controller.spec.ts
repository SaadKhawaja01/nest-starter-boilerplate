import { Test, TestingModule } from "@nestjs/testing";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";

const mockCacheManager = {};
describe("StripeController", () => {
  let controller: StripeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeController],
      providers: [
        StripeService,
        { provide: "STRIPE_CACHE", useValue: mockCacheManager },
      ],
    }).compile();

    controller = module.get<StripeController>(StripeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
