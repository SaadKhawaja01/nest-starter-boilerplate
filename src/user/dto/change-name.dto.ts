import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangeNameDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
