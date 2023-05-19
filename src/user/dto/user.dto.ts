import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../enums/role.enum";

export class UserDto {
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: Role,
    enumName: "Role",
  })
  role: Role;

  @ApiProperty()
  emailVerifiedAt: Date;
}
