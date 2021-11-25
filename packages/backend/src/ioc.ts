import { createInjector } from "typed-inject";
import { UserRepository } from "@/modules/user/user-repository";
import { CreateUserUseCase } from "@/modules/user/use-cases/create-user/create-user-use-case";
import { CreateUserController } from "@/modules/user/use-cases/create-user/create-user-controller";
import { router } from "@/router";

export enum InjectToken {
  UserRepository = "UserRepository",
  CreateUserUseCase = "CreateUserUseCase",
  CreateUserController = "CreateUserController",
  Router = "Router",
}

export const injector = createInjector()
  .provideValue(InjectToken.Router, router)
  .provideClass(InjectToken.UserRepository, UserRepository)
  .provideClass(InjectToken.CreateUserUseCase, CreateUserUseCase)
  .provideClass(InjectToken.CreateUserController, CreateUserController);
