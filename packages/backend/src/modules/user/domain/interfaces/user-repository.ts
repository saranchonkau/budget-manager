import { User } from "../user";

export interface UserRepository {
  create(user: User): Promise<void>;
  getById(id: User["id"]): Promise<User | null>;
  getByEmail(email: User["email"]): Promise<User | null>;
  exists(email: User["email"]): Promise<boolean>;
}
