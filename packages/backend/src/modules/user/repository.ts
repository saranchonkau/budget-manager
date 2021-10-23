import knex from "../../knex/knex-instance.js";
import { UserDBPayload } from "./model.js";

interface CreateUserPayload {
  email: string;
  password_hash: string;
  name: string;
}

interface DateFields {
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

function generateDateFields(): DateFields {
  const now = new Date();
  const epoch = new Date(0);
  return {
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    deleted_at: epoch.toISOString(),
  };
}

class UserRepository {
  create(userFields: CreateUserPayload): Promise<number> {
    const userPayload: UserDBPayload = {
      ...generateDateFields(),
      ...userFields,
    };
    return knex("user")
      .returning("id")
      .insert(userPayload)
      .then((ids) => {
        const userId = ids[0];

        if (userId === undefined) {
          throw new Error("User id is empty");
        }

        return userId;
      });
  }
}

export const userRepository = new UserRepository();
