import knex from "@/knex/knex-instance";

import { User } from "./domain/user";
import { UserPersistence } from "./domain/user-persistence";
import { userMapper } from "./domain/user-mapper";
import { UserRepository } from "./domain/interfaces/user-repository";

export class UserRepositoryImpl implements UserRepository {
  private users() {
    return knex.table<UserPersistence>("user");
  }

  getByEmail(email: User["email"]): Promise<User | null> {
    return this.users()
      .where("email", email)
      .then((result) => {
        const user = result[0] ?? null;
        return user ? userMapper.toDomain(user) : null;
      });
  }

  getById(id: User["id"]): Promise<User | null> {
    return this.users()
      .where("id", id)
      .then((result) => {
        const user = result[0] ?? null;
        return user ? userMapper.toDomain(user) : null;
      });
  }

  async exists(email: User["email"]): Promise<boolean> {
    const user = await this.getByEmail(email);
    return Boolean(user);
  }

  create(user: User): Promise<void> {
    const userPersistence = userMapper.toPersistence(user);
    return this.users().insert(userPersistence);
  }
}
