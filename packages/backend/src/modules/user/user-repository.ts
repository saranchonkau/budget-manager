import knex from "@/knex/knex-instance";

import { User } from "./domain/user";
import { UserRepositoryModel } from "./domain/user-repository-model";
import { UserPersistence } from "./domain/user-persistence";
import { userMapper } from "./domain/user-mapper";

export class UserRepository implements UserRepositoryModel {
  private users() {
    return knex.table<UserPersistence>("user");
  }

  getByEmail(email: string): Promise<User | null> {
    return this.users()
      .where("email", email)
      .then((result) => {
        const user = result[0] ?? null;
        return user ? userMapper.toDomain(user) : null;
      });
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return Boolean(user);
  }

  create(user: User): Promise<void> {
    const userPersistence = userMapper.toPersistence(user);
    return this.users().insert(userPersistence);
  }
}
