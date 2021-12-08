import { AppRequest } from "@/shared/app-request";
import { InjectToken } from "@/constants/injection-tokens";
import { AuthTokenService } from "@/modules/auth/domain/auth-token-service";
import { StatusCodes } from "http-status-codes";
import { BaseRequestFilter } from "@/shared/base-request-filter";

export class AuthenticatedFilter extends BaseRequestFilter {
  constructor(private authTokenService: AuthTokenService) {
    super();
  }

  public static inject = [InjectToken.AuthTokenService] as const;

  protected override failed(appRequest: AppRequest) {
    appRequest.respond(StatusCodes.UNAUTHORIZED);
    return { isPassed: false };
  }

  public async filter(appRequest: AppRequest) {
    const authToken = this.authTokenService.getTokenFromAppRequest(appRequest);

    if (!authToken) {
      return this.failed(appRequest);
    }

    const jwtPayload = await this.authTokenService.verifyToken(authToken);

    if (jwtPayload.isLeft()) {
      return this.failed(appRequest);
    }

    return this.passed();
  }
}
