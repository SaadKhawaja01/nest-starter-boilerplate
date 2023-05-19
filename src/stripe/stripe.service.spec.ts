import { Test, TestingModule } from "@nestjs/testing";
import { StripeService } from "./stripe.service";
const mockCacheManager = {};
describe("StripeService", () => {
  let service: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: "STRIPE_CACHE", useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
