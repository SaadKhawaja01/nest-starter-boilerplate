import { ApiProperty } from "@nestjs/swagger";

export class StringResponseDto {
  @ApiProperty({ default: "custom response message will be received." })
  message: string;
}
