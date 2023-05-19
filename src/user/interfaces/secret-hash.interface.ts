import { SecretType } from "../enums/secret-type.enum";

export interface SecretHash {
  type: SecretType;
  value: string;
}
