import { BaseController } from "@/shared/controller";
import { AppRequest } from "@/shared/app-request";
import { CommandResponse } from "@/shared/response";

import { CreateUserDTOContract } from "./create-user-dto";
import {
  CreateUserUseCase,
  CreateUserUseCaseResponse,
} from "./create-user-use-case";
import { AppErrorBrand } from "@/shared/app-error-brands";
import { Left } from "@/types/common";
import { StatusCodes } from "http-status-codes";
import { InjectToken } from "@/ioc";

export class CreateUserController implements BaseController {
  constructor(private useCase: CreateUserUseCase) {}

  public static inject = [InjectToken.CreateUserUseCase] as const;

  getErrorResponseStatus(error: Left<CreateUserUseCaseResponse>): number {
    switch (error.brand) {
      case AppErrorBrand.ValidationError:
      case AppErrorBrand.UserAlreadyExistsError:
        return StatusCodes.BAD_REQUEST;
      default:
        return StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }

  async execute(appRequest: AppRequest): Promise<void> {
    const bodyOrError = appRequest.parseJsonBody(CreateUserDTOContract);

    if (bodyOrError.isLeft()) {
      return appRequest.sendError(StatusCodes.BAD_REQUEST, bodyOrError.value);
    }

    const result = await this.useCase.execute(bodyOrError.value);

    if (result.isLeft()) {
      const error = result.value;
      const statusCode = this.getErrorResponseStatus(error);
      return appRequest.sendError(statusCode, error);
    }

    return appRequest.send(
      new CommandResponse({
        message: "User successfully created",
        data: result.value,
      })
    );
  }
}
