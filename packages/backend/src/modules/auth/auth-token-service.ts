import { Environment } from "@/environment";
import { InjectToken } from "@/constants/injection-tokens";
import { User } from "@/modules/user/domain/user";
import { decode, sign, verify, VerifyErrors } from "jsonwebtoken";
import { Either, left, right } from "@sweet-monads/either";
import { CustomJwtPayload } from "@/modules/auth/domain/custom-jwt-payload";
import { AppRequest } from "@/shared/app-request";
import { Uuid } from "@/shared/uuid";
import {
  AuthTokenService,
  AuthTokenType,
} from "@/modules/auth/domain/auth-token-service";

export class AuthTokenServiceImpl implements AuthTokenService {
  constructor(private environment: Environment) {}

  public static inject = [InjectToken.Environment] as const;

  private convertCallbackArgs<E, T>(
    error: E | null,
    result: T | undefined
  ): { error: E; result: null } | { error: null; result: T } {
    if (error) {
      return { error, result: null };
    }

    return { error: null, result: result as T };
  }

  createToken(userId: User["id"]): Promise<AuthTokenType> {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({ userId });

      sign(payload, this.environment.jwtSecret, (...args) => {
        const params = this.convertCallbackArgs(...args);

        if (params.error) {
          reject(params.error);
        } else {
          resolve(params.result as AuthTokenType);
        }
      });
    });
  }

  verifyToken(token: string): Promise<Either<VerifyErrors, CustomJwtPayload>> {
    return new Promise((resolve) => {
      verify(token, this.environment.jwtSecret, (...args) => {
        const params = this.convertCallbackArgs(...args);

        if (params.error) {
          resolve(left(params.error));
        } else {
          resolve(right(params.result as CustomJwtPayload));
        }
      });
    });
  }

  getJwtPayloadFromAppRequest(appRequest: AppRequest): CustomJwtPayload {
    const token = this.getTokenFromAppRequest(appRequest);

    const result = decode(token, { json: true });

    if (!result) {
      throw new Error(
        "Error during decoding the jwt. Maybe you forgot to add Authorized filter."
      );
    }

    return result as CustomJwtPayload;
  }

  getUserId(appRequest: AppRequest): Uuid {
    const payload = this.getJwtPayloadFromAppRequest(appRequest);

    const uuidOrError = Uuid.from(payload.userId);

    if (uuidOrError.isLeft()) {
      throw new Error("Invalid userId in auth token");
    }

    return uuidOrError.value;
  }

  getTokenFromAppRequest(appRequest: AppRequest): string {
    const authHeader = appRequest.headers.authorization || "";
    return authHeader.slice("Bearer ".length);
  }
}
