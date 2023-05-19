import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { ImageKitModule } from "../image-kit/image-kit.module";
import { MailerModule } from "../mailer/mailer.module";
import { StripeService } from "../stripe/stripe.service";

const mockModel = {
  findOne: jest.fn(),
};

const mockCachManager = {};
describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailerModule, ImageKitModule],
      providers: [
        JwtService,
        UserService,
        StripeService,
        { provide: "UserModel", useValue: mockModel },
        { provide: "STRIPE_CACHE", useValue: mockCachManager },
      ],
    }).compile();

    service = await module.resolve<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
