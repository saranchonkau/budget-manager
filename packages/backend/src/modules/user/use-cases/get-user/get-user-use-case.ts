import { Either, left, right } from "@sweet-monads/either";
import { Uuid } from "@/shared/uuid";
import { User } from "@/modules/user/domain/user";
import { InjectToken } from "@/constants/injection-tokens";
import { UseCase } from "@/shared/use-case";
import { UserRepository } from "@/modules/user/domain/interfaces/user-repository";

import { UserNotFoundError } from "./get-user-errors";

export type GetUserUseCaseResponse = Either<UserNotFoundError, User>;

export interface GetUserUseCase extends UseCase<Uuid, GetUserUseCaseResponse> {}

export class GetUserUseCaseImpl implements GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  public static inject = [InjectToken.UserRepository] as const;

  async execute(userId: Uuid): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.getById(userId.value);

    if (!user) {
      return left(new UserNotFoundError(userId.value));
    }

    return right(user);
  }
}
