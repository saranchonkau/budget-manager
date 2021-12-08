import { Mapper } from "@/shared/mapper-model";
import { Uuid } from "@/shared/uuid";
import { ValidationError } from "@/shared/validation-error";
import { divideLeftAndRight } from "@/utils/resolve-validation-errors";

import { UserPersistence } from "./user-persistence";
import { UserDto } from "./user-dto";
import { User } from "./user";
import { UserPasswordHash } from "./user-password";
import { UserEmail } from "./user-email";
import { UserName } from "./user-name";

class UserMapper implements Mapper<UserPersistence, User, UserDto> {
  toPersistence(user: User): UserPersistence {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.password_hash.toString(),
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt,
    };
  }
  toDomain(user: UserPersistence) {
    const props = {
      id: Uuid.from(user.id),
      email: UserEmail.from(user.email),
      name: UserName.from(user.name),
    };

    const result = divideLeftAndRight(props);

    if (result.isLeft()) {
      throw new ValidationError({
        message: "User persistence is invalid and cannot be mapped to domain.",
        payload: result.value,
      });
    }

    const { id, name, email } = result.value;
    const passwordHash = UserPasswordHash.fromHash(user.password_hash);

    return User.create(
      {
        name: name,
        email: email,
        passwordHash: passwordHash,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        deletedAt: user.deleted_at,
      },
      id
    );
  }
  toDTO(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt.toISOString(),
    };
  }
}

export const userMapper = new UserMapper();
