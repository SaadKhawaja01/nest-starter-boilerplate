import { Role } from "../enums/role.enum";

export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}
