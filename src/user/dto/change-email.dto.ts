import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { emailSerializer } from "../serializers/email.serializer";

export class ChangeEmailDto {
  @ApiProperty({ default: "ahsantariq1709@gmail.com" })
  @Transform(emailSerializer)
  @IsEmail()
  @IsNotEmpty()
  oldEmail: string;

  @ApiProperty({ default: "ahsantariq1713@gmail.com" })
  @Transform(emailSerializer)
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;
}
