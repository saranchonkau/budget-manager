import { createInjector } from "typed-inject";
import { UserRepositoryImpl } from "@/modules/user/user-repository";
import { CreateUserUseCaseImpl } from "@/modules/user/use-cases/create-user/create-user-use-case";
import { router } from "@/router";
import { InjectToken } from "@/constants/injection-tokens";
import environment from "@/environment";
import { AuthTokenServiceImpl } from "@/modules/auth/auth-token-service";
import { GetUserUseCaseImpl } from "@/modules/user/use-cases/get-user/get-user-use-case";
import { AuthenticatedFilter } from "@/modules/auth/authenticated-filter";

export const injector = createInjector()
  .provideValue(InjectToken.Router, router)
  .provideClass(InjectToken.UserRepository, UserRepositoryImpl)
  .provideClass(InjectToken.CreateUserUseCase, CreateUserUseCaseImpl)
  .provideValue(InjectToken.Environment, environment)
  .provideClass(InjectToken.AuthTokenService, AuthTokenServiceImpl)
  .provideClass(InjectToken.GetUserUseCase, GetUserUseCaseImpl)
  .provideClass(InjectToken.AuthorizedFilter, AuthenticatedFilter);

export const instanceOf = injector.injectClass.bind(injector);
