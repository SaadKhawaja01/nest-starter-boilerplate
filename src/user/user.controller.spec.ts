import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MailerService } from "../mailer/mailer.service";
import { ImageService } from "../image-kit/image.service";
import { StripeService } from "../stripe/stripe.service";

const companyMockModel = {
  findOne: jest.fn(),
};

const mockCachManager = {};
describe("UserController", () => {
  let controller: UserController;

  const mockModel = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        JwtService,
        UserService,
        MailerService,
        ImageService,
        StripeService,
        { provide: "UserModel", useValue: mockModel },
        { provide: "CompanyModel", useValue: companyMockModel },
        { provide: "STRIPE_CACHE", useValue: mockCachManager },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", async () => {
    expect(controller).toBeDefined();
  });
});
