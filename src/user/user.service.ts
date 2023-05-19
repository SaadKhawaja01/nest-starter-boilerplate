import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./entities/user.entity";
import { Model, now } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { SignedUserDto } from "./dto/signed-user.dto";
import { Role } from "./enums/role.enum";
import { SecretType } from "./enums/secret-type.enum";
import { LoginDto } from "src/user/dto/login.dto";
import { ResetPasswordDto } from "src/user/dto/reset-password.dto";
import { EmailDto } from "src/user/dto/email.dto";
import { ChangePasswordDto } from "src/user/dto/change-password.dto";
import { RegisterDto } from "src/user/dto/register.dto";
import { OtpDto } from "src/user/dto/otp.dto";
import { MailerService } from "../mailer/mailer.service";
import { ResendOtpDto } from "src/user/dto/resend-otp.dto";
import { ChangeNameDto } from "src/user/dto/change-name.dto";
import { ImageService } from "../image-kit/image.service";
import { IJwtPayload } from "./interfaces/ijwt-payload.interface";
import { StripeService } from "../stripe/stripe.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    public readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly imageService: ImageService,
    private readonly stripeService: StripeService,
  ) {}

  async checkEmailAvailability(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new UnprocessableEntityException("Email is taken.");
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        "We couldn't find an account with that email address.",
      );
    }
    return user;
  }

  async generateOTP(type: SecretType, user: UserDocument) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = bcrypt.hashSync(otp, bcrypt.genSaltSync());
    user.secrets = user.secrets.filter((secret) => secret.type !== type);
    user.secrets.push({ type, value: otpHash });
    await user.save();
    this.mailerService.send(
      [user.email],
      type,
      `Use this OTP ${otp} for ${type}`,
    );
    return otp;
  }

  async registerAccount(data: RegisterDto) {
    await this.checkEmailAvailability(data.email);
    const user = new this.userModel({
      name: data.name,
      email: data.email,
      password: bcrypt.hashSync(data.password, bcrypt.genSaltSync()),
      major: Role.User,
    });

    await this.generateOTP(SecretType.EmailVerification, user);
    await user.save();
    await this.stripeService.ensureCustomerCreated(user);
    return user;
  }

  async verifyEmail(data: OtpDto, user: UserDocument) {
    await this.verifyOTP(data.otp, SecretType.EmailVerification, user);
    user.emailVerifiedAt = now();
    await user.save();
    return user;
  }

  //change avatar
  async changeAvatar(file, user: UserDocument) {
    const imageUploaded = await this.imageService.upload(file);
    user.avatar = imageUploaded.thumbnailUrl;
    return user.save();
  }

  async validateCredentials(data: LoginDto) {
    const user = await this.userModel.findOne({ email: data.email });
    const credentialsValid =
      user && bcrypt.compareSync(data.password, user.password);
    if (!credentialsValid) {
      throw new UnauthorizedException("Incorrect email or password.");
    }
    return user;
  }

  async forgotPassword(data: EmailDto) {
    const user = await this.findUserByEmail(data.email);
    await this.generateOTP(SecretType.ResetPassword, user);
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.findUserByEmail(data.email);
    await this.verifyOTP(data.otp, SecretType.ResetPassword, user);
    user.password = bcrypt.hashSync(data.newPassword, bcrypt.genSaltSync());
    await user.save();
  }

  async changePassword(data: ChangePasswordDto, user: UserDocument) {
    if (!bcrypt.compareSync(data.oldPassword, user.password)) {
      throw new UnprocessableEntityException("Old Password was incorrect.");
    }
    user.password = bcrypt.hashSync(data.newPassword, bcrypt.genSaltSync());
    await user.save();
  }

  async changeEmail(data: EmailDto, user: UserDocument) {
    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException(
        "You cannot change verified email.",
      );
    }

    await this.checkEmailAvailability(data.email);
    user.email = data.email;
    await user.save();
    await this.generateOTP(SecretType.EmailVerification, user);
    return user;
  }

  async switchEmail(data: EmailDto, user: UserDocument) {
    await this.checkEmailAvailability(data.email);
    user.tempEmail = data.email;
    await user.save();
    await this.generateOTP(SecretType.SwitchEmail, user);
  }

  async verifySwitchedEmail(data: OtpDto, user: UserDocument) {
    await this.verifyOTP(data.otp, SecretType.SwitchEmail, user);
    user.email = user.tempEmail;
    user.tempEmail = null;
    user.emailVerifiedAt = now();
    return await user.save();
  }

  async updateUser(data: ChangeNameDto, user: UserDocument) {
    user.name = data.name;
    return user.save();
  }

  async resendOTP(data: ResendOtpDto) {
    const user = await this.findUserByEmail(data.email);
    await this.generateOTP(data.type, user);
  }

  async signUser(user: User): Promise<SignedUserDto> {
    const payload: IJwtPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      accessToken: token,
    };
  }

  private async verifyOTP(otp: string, type: SecretType, user: UserDocument) {
    const secret = user.secrets.find((x) => x.type === type);
    const validateOtp = secret && bcrypt.compareSync(otp, secret.value);
    if (!validateOtp) {
      throw new UnprocessableEntityException("OTP is invalid or expired.");
    }
    user.secrets = user.secrets.filter((x) => x.type !== type);
    await user.save();
  }
}
