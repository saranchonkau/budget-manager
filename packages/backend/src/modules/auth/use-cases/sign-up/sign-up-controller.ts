import { StatusCodes } from "http-status-codes";

import { AppRequest } from "@/shared/app-request";
import { CommandResponse } from "@/shared/response";
import { AppErrorBrand } from "@/shared/app-error-brands";
import { Left } from "@/types/common";
import { InjectToken } from "@/constants/injection-tokens";
import { userMapper } from "@/modules/user/domain/user-mapper";
import { Controller } from "@/shared/controller";

import { CreateUserDTOContract } from "@/modules/user/use-cases/create-user/create-user-dto";
import {
  CreateUserUseCase,
  CreateUserUseCaseResponse,
} from "@/modules/user/use-cases/create-user/create-user-use-case";
import { AuthTokenService } from "@/modules/auth/domain/auth-token-service";
import { SignUpDto } from "@/modules/auth/use-cases/sign-up/sign-up-dto";

export class SignUpController implements Controller {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private authTokenService: AuthTokenService
  ) {}

  public static inject = [
    InjectToken.CreateUserUseCase,
    InjectToken.AuthTokenService,
  ] as const;

  getErrorResponseStatus(error: Left<CreateUserUseCaseResponse>): number {
    switch (error.brand) {
      case AppErrorBrand.ValidationError:
      case AppErrorBrand.UserAlreadyExistsError:
        return StatusCodes.BAD_REQUEST;
      default:
        return StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }

  async execute(appRequest: AppRequest) {
    const bodyOrError = appRequest.parseJsonBody(CreateUserDTOContract);

    if (bodyOrError.isLeft()) {
      return appRequest.sendError(StatusCodes.BAD_REQUEST, bodyOrError.value);
    }

    const result = await this.createUserUseCase.execute(bodyOrError.value);

    if (result.isLeft()) {
      const error = result.value;
      const statusCode = this.getErrorResponseStatus(error);
      return appRequest.sendError(statusCode, error);
    }

    const user = result.value;

    const accessToken = await this.authTokenService.createToken(user.id);

    return appRequest.send(
      new CommandResponse<SignUpDto>({
        message: "User have been successfully created",
        data: { accessToken, user: userMapper.toDTO(user) },
      })
    );
  }
}
