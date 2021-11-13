import * as t from "io-ts";
import { withMessage } from "io-ts-types/lib/withMessage";

interface UserNameBrand {
  readonly UserName: unique symbol;
}

export const UserName = withMessage(
  t.brand(
    t.string,
    (s: string): s is t.Branded<string, UserNameBrand> => s.length > 0,
    "UserName"
  ),
  (input) => `User name value must be a non empty string, got: "${input}"`
);

export type UserNameType = t.TypeOf<typeof UserName>;
