import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { emailSerializer } from "../serializers/email.serializer";

export class LoginDto {
  @ApiProperty({ default: "ahsantariq1713@gmail.com" })
  @Transform(emailSerializer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: "password" })
  @IsNotEmpty()
  password: string;
}
