import knex from "../../knex/knex-instance.js";

import { User } from "./domain/user";
import { UserRepositoryModel } from "./domain/user-repository-model";
import { UserPersistence } from "./domain/user-persistence";
import { userMapper } from "./domain/user-mapper";

class UserRepository implements UserRepositoryModel {
  private users() {
    return knex.table<UserPersistence>("user");
  }

  getByEmail(email: string): Promise<User | null> {
    return this.users()
      .where("email", email)
      .then((result) => {
        const user = result[0];
        return user ? userMapper.toDomain(user) : null;
      });
  }

  create(user: User): Promise<void> {
    const userPersistence = userMapper.toPersistence(user);
    return this.users().insert(userPersistence);
  }
}

export const userRepository = new UserRepository();
