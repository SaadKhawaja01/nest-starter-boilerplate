import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ default: "password" })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ default: "password123" })
  @IsNotEmpty()
  newPassword: string;
}
