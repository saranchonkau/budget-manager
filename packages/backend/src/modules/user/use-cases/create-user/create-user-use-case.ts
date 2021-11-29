import { CreateUserDTO } from "./create-user-dto";
import { Either, left, right } from "@sweet-monads/either";
import { UserAlreadyExistsError } from "./create-user-errors";
import { UserEmail } from "../../domain/user-email";
import { Uuid } from "@/shared/uuid";
import { UserPassword, UserPasswordHash } from "../../domain/user-password";
import { UserName } from "../../domain/user-name";
import { User } from "../../domain/user";
import { divideLeftAndRight } from "@/utils/resolve-validation-errors";
import { ValidationError } from "@/shared/validation-error";
import { ZodError } from "zod";
import { UserRepositoryModel } from "@/modules/user/domain/user-repository-model";
import { InjectToken } from "@/constants/injection-tokens";

export type CreateUserUseCaseResponse = Either<
  | ValidationError<{
      email?: ZodError;
      password?: ZodError;
      name?: ZodError;
    }>
  | UserAlreadyExistsError,
  User
>;

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryModel) {}
  public static inject = [InjectToken.UserRepository] as const;

  async execute(dto: CreateUserDTO): Promise<CreateUserUseCaseResponse> {
    const uuid = Uuid.create();

    const emailOrError = UserEmail.from(dto.email);
    const passwordOrError = UserPassword.from(dto.password);
    const nameOrError = UserName.from(dto.name);

    const result = divideLeftAndRight({
      email: emailOrError,
      password: passwordOrError,
      name: nameOrError,
    });

    if (result.isLeft()) {
      return left(
        new ValidationError({
          payload: result.value,
          message: "Invalid user payload",
        })
      );
    }

    const { email, password, name } = result.value;

    const passwordHash = await UserPasswordHash.fromPassword(password);

    const user = User.create({ email, passwordHash, name }, uuid);

    const isUserAlreadyExists = await this.userRepository.exists(email.value);

    if (isUserAlreadyExists) {
      return left(new UserAlreadyExistsError(user.email));
    }

    await this.userRepository.create(user);

    return right(user);
  }
}
