import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { emailSerializer } from "../serializers/email.serializer";

export class ResetPasswordDto {
  @ApiProperty({ default: "ahsantariq1713@gmail.com" })
  @Transform(emailSerializer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: "171314" })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ default: "secret1234" })
  @IsNotEmpty()
  newPassword: string;
}
