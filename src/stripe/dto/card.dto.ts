import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CardDto {
  @ApiProperty({ default: "4242424242424242" })
  @IsNotEmpty()
  number: string;

  @ApiProperty({ default: 12 })
  @IsNumber()
  @IsNotEmpty()
  exp_month: number;

  @ApiProperty({ default: 23 })
  @IsNumber()
  @IsNotEmpty()
  exp_year: number;

  @ApiProperty({ default: "170" })
  @IsNotEmpty()
  cvc: string;
}
