import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  planId: string;
}
