import { UserDto } from "@/modules/user/domain/user-dto";
import { AuthTokenType } from "@/modules/auth/domain/auth-token-service";

export interface SignUpDto {
  readonly accessToken: AuthTokenType;
  readonly user: UserDto;
}
