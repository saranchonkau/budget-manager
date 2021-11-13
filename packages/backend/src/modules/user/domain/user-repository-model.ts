import { User } from "./user";

export interface UserRepositoryModel {
  create(user: User): Promise<void>;
  getByEmail(email: string): Promise<User | null>;
}
