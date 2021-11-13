import * as t from "io-ts";
import { Entity } from "../../../shared/entity";
import { EPOCH_TIMESTAMP } from "../../../constants/common";
import { getNowTimestamp } from "../../../utils/get-now-timestamp";
import { UuidType } from "../../../shared/uuid";
import { Email } from "./user-email";
import { UserName } from "./user-name";
import { Either, isRight, right } from "fp-ts/Either";
import { v4 as generateUuid } from "uuid";
import { sequenceT } from "fp-ts/Apply";
import { either } from "fp-ts";

export const UserPropsContract = t.type(
  {
    email: Email,
    password_hash: t.string,
    name: UserName,
    created_at: t.string,
    updated_at: t.string,
    deleted_at: t.string,
  },
  "User"
);

export interface IncomingUserProps {
  readonly email: string;
  readonly password_hash: string;
  readonly name: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly deleted_at?: string;
}

export interface UserProps {
  readonly email: string;
  readonly password_hash: string;
  readonly name: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id: UuidType) {
    super(props, id);
  }

  public get id(): UuidType {
    return this._id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get name(): string {
    return this.props.name;
  }

  public get password_hash(): string {
    return this.props.password_hash;
  }

  public get created_at(): string {
    return this.props.created_at;
  }

  public get updated_at(): string {
    return this.props.updated_at;
  }

  public get deleted_at(): string {
    return this.props.deleted_at;
  }

  public static create(
    props: IncomingUserProps,
    id?: UuidType
  ): Either<t.Errors, User> {
    const nowTimestamp = getNowTimestamp();

    // const result = sequenceT(either.Apply)(
    //     Email.decode(props.email),
    //     UserName.decode(props.name)
    // );

    const userProps = UserPropsContract.decode({
      email: props.email,
      name: props.name,
      password_hash: props.password_hash,
      created_at: props.created_at ?? nowTimestamp,
      updated_at: props.updated_at ?? nowTimestamp,
      deleted_at: props.deleted_at ?? EPOCH_TIMESTAMP,
    });

    if (isRight(userProps)) {
      return right(new User(userProps.right, id ?? generateUuid()));
    } else {
      return userProps;
    }
  }
}
