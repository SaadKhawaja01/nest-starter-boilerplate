import { UserDto } from "./user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SignedUserDto {
  @ApiProperty({
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty()
  accessToken: string;
}
