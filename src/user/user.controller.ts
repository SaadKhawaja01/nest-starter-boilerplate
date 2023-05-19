import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { StringResponseDto } from "../common/dto/string-respone.dto";
import { UserRequest } from "../common/interfaces/request.interface";
import { SignedUserDto } from "./dto/signed-user.dto";
import { EmailDto } from "./dto/email.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { OtpDto } from "./dto/otp.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResendOtpDto } from "./dto/resend-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtGuard } from "./guards/jwt/jwt.guard";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { ChangeNameDto } from "./dto/change-name.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: SignedUserDto, status: 200 })
  @Post("login")
  async login(@Body() body: LoginDto): Promise<SignedUserDto> {
    const user = await this.userService.validateCredentials(body);
    return this.userService.signUser(user);
  }

  @ApiResponse({ type: StringResponseDto, status: 200 })
  @Post("forgot-password")
  async forgotPassword(@Body() body: EmailDto): Promise<StringResponseDto> {
    await this.userService.forgotPassword(body);
    return {
      message: `We have sent an OTP to ${body.email}`,
    };
  }

  @ApiResponse({ type: StringResponseDto, status: 200 })
  @Post("reset-password")
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<StringResponseDto> {
    await this.userService.resetPassword(body);
    return {
      message: "Password reset successfully",
    };
  }

  @ApiResponse({ type: SignedUserDto, status: 200 })
  @Post("register")
  async register(@Body() body: RegisterDto): Promise<SignedUserDto> {
    const user = await this.userService.registerAccount(body);
    return this.userService.signUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: SignedUserDto, status: 200 })
  @Post("change-email")
  async changeEmail(
    @Body() body: EmailDto,
    @Req() { user }: UserRequest,
  ): Promise<SignedUserDto> {
    const updatedUser = await this.userService.changeEmail(body, user);
    return this.userService.signUser(updatedUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: UserDto, status: 200 })
  @Post("verify-email")
  async verifyEmail(
    @Body() body: OtpDto,
    @Req() { user }: UserRequest,
  ): Promise<UserDto> {
    return this.userService.verifyEmail(body, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: StringResponseDto, status: 200 })
  @Post("switch-email")
  async switchEmail(
    @Body() body: EmailDto,
    @Req() { user }: UserRequest,
  ): Promise<StringResponseDto> {
    await this.userService.switchEmail(body, user);
    return {
      message: `We have sent an OTP to ${body.email}`,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: SignedUserDto, status: 200 })
  @Post("verify-switched-email")
  async verifySwitchedEmail(
    @Body() body: OtpDto,
    @Req() { user }: UserRequest,
  ): Promise<SignedUserDto> {
    const updatedUser = await this.userService.verifySwitchedEmail(body, user);
    return this.userService.signUser(updatedUser);
  }

  @ApiResponse({ type: StringResponseDto, status: 200 })
  @Post("resend-otp")
  async resendOTP(@Body() body: ResendOtpDto): Promise<StringResponseDto> {
    await this.userService.resendOTP(body);
    return {
      message: `We have sent an OTP to ${body.email}`,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ type: UserDto, status: 200 })
  @Patch("change-avatar")
  async changeAvatar(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() { user }: UserRequest,
  ): Promise<UserDto> {
    return this.userService.changeAvatar(file, user);
    //
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: StringResponseDto, status: 200 })
  @Patch("change-password")
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() { user }: UserRequest,
  ): Promise<StringResponseDto> {
    await this.userService.changePassword(body, user);
    return { message: "Password changed successfully" };
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: UserDto, status: 200 })
  @Patch("change-name")
  async updateUser(
    @Body() body: ChangeNameDto,
    @Req() { user }: UserRequest,
  ): Promise<UserDto> {
    return await this.userService.updateUser(body, user);
  }
}
