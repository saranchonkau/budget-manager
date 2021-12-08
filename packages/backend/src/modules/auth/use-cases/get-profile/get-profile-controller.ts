import { StatusCodes } from "http-status-codes";

import { AppRequest } from "@/shared/app-request";
import { QueryResponse } from "@/shared/response";
import { AppErrorBrand } from "@/shared/app-error-brands";
import { Left } from "@/types/common";
import { InjectToken } from "@/constants/injection-tokens";
import { userMapper } from "@/modules/user/domain/user-mapper";
import { Controller } from "@/shared/controller";
import { UserDto } from "@/modules/user/domain/user-dto";
import {
  GetUserUseCase,
  GetUserUseCaseResponse,
} from "@/modules/user/use-cases/get-user/get-user-use-case";
import { AuthTokenService } from "@/modules/auth/domain/auth-token-service";

export class GetProfileController implements Controller {
  constructor(
    private getUserUseCase: GetUserUseCase,
    private authTokenService: AuthTokenService
  ) {}

  public static inject = [
    InjectToken.GetUserUseCase,
    InjectToken.AuthTokenService,
  ] as const;

  getErrorResponseStatus(error: Left<GetUserUseCaseResponse>): number {
    switch (error.brand) {
      case AppErrorBrand.UserNotFoundError:
        return StatusCodes.NOT_FOUND;
      default:
        return StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }

  async execute(appRequest: AppRequest) {
    const userId = this.authTokenService.getUserId(appRequest);
    const result = await this.getUserUseCase.execute(userId);

    if (result.isLeft()) {
      const error = result.value;
      const statusCode = this.getErrorResponseStatus(error);
      return appRequest.sendError(statusCode, error);
    }

    return appRequest.send(
      new QueryResponse<UserDto>({
        data: userMapper.toDTO(result.value),
      })
    );
  }
}
