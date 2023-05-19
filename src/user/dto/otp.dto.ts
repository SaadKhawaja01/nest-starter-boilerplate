import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class OtpDto {
  @ApiProperty({ default: "125355" })
  @IsNotEmpty()
  otp: string;
}
