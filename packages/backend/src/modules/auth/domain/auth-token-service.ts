import { VerifyErrors } from "jsonwebtoken";
import { User } from "@/modules/user/domain/user";
import { Either } from "@sweet-monads/either";
import { CustomJwtPayload } from "@/modules/auth/domain/custom-jwt-payload";
import { AppRequest } from "@/shared/app-request";
import { Uuid } from "@/shared/uuid";

export type AuthTokenType = string & { readonly _brand_: unique symbol };

export interface AuthTokenService {
  createToken(userId: User["id"]): Promise<AuthTokenType>;
  verifyToken(token: string): Promise<Either<VerifyErrors, CustomJwtPayload>>;
  getTokenFromAppRequest(appRequest: AppRequest): string;
  getJwtPayloadFromAppRequest(appRequest: AppRequest): CustomJwtPayload;
  getUserId(appRequest: AppRequest): Uuid;
}
