import { ApiProperty } from "@nestjs/swagger";

export class PlanDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  currency: string;
  @ApiProperty()
  interval: string;
  @ApiProperty()
  amount: number;
}
