import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

import { Transform } from "class-transformer";
import { emailSerializer } from "../serializers/email.serializer";

export class RegisterDto {
  @ApiProperty({ default: "Ahsan Tariq" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: "ahsantariq1713@gmail.com" })
  @Transform(emailSerializer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: "password" })
  @IsNotEmpty()
  password: string;
}
