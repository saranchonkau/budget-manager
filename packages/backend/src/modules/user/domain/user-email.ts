import * as t from "io-ts";
import { withMessage } from "io-ts-types/lib/withMessage";

/**
 * Reference: {@link https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)}
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

interface EmailBrand {
  readonly Email: unique symbol;
}

export const Email = withMessage(
  t.brand(
    t.string,
    (s: string): s is t.Branded<string, EmailBrand> => EMAIL_REGEX.test(s),
    "Email"
  ),
  (input) => `Email value must be a valid email address, got: ${input}`
);

export type EmailType = t.TypeOf<typeof Email>;
