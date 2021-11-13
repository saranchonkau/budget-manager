import { Mapper } from "../../../shared/mapper-model";
import { UserPersistence } from "./user-persistence";
import { UserDto } from "./user-dto";
import { User } from "./user";

class UserMapper implements Mapper<UserPersistence, User, UserDto> {
  toPersistence(user: User): UserPersistence {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.password_hash,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
    };
  }
  toDomain(persistence: UserPersistence): User {
    const { id, ...props } = persistence;
    return User.create(props, id);
  }
  toDTO(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
    };
  }
}

export const userMapper = new UserMapper();
