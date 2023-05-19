import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { SecretType } from "../enums/secret-type.enum";
import { emailSerializer } from "../serializers/email.serializer";

export class ResendOtpDto {
  @ApiProperty({ default: "ahsantariq1713@gmail.com" })
  @Transform(emailSerializer)
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: SecretType,
    enumName: "SecretType",
  })
  @IsNotEmpty()
  type: SecretType;
}
