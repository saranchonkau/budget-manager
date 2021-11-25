import * as z from "zod";
import { ValueObject } from "../../../shared/value-object";
import { parseWithContract } from "../../../shared/parse-with-contract";

type UserEmailType = string & { readonly _brand_: unique symbol };

/**
 * Reference: {@link https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)}
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isUserEmail(value: string): value is UserEmailType {
  return EMAIL_REGEX.test(value);
}

export const UserEmailContract = z.string().refine(isUserEmail, (value) => ({
  message: `User email value must be a valid email address, got: "${value}"`,
}));

interface UserEmailProps {
  value: UserEmailType;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  private constructor(props: UserEmailProps) {
    super(props);
  }

  public get value() {
    return this.props.value;
  }

  public static from(value: string) {
    return parseWithContract(UserEmailContract, value).mapRight(
      (value) => new UserEmail({ value })
    );
  }
}
