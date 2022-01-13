import * as z from "zod";
import { ValueObject } from "@/shared/value-object";
import { parseWithContract } from "@/shared/parse-with-contract";

type UserNameType = string & { readonly _brand_: unique symbol };

function isUserNameValid(name: string): name is UserNameType {
  return name.trim().length > 0;
}

export const UserNameContract = z.string().refine(isUserNameValid, (value) => ({
  message: `User name value must be a non empty string, got: "${value}"`,
}));

interface UserNameProps {
  value: UserNameType;
}

export class UserName extends ValueObject<UserNameProps> {
  private constructor(props: UserNameProps) {
    super(props);
  }

  public get value() {
    return this.props.value;
  }

  public static from(value: string) {
    return parseWithContract(UserNameContract, value).mapRight(
      (value) => new UserName({ value })
    );
  }
}
