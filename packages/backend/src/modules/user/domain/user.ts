import { Entity } from "@/shared/entity";
import { Uuid } from "@/shared/uuid";
import { getEpochDate, getNowDate } from "@/utils/get-date";

import { UserEmail } from "./user-email";
import { UserPasswordHash } from "./user-password";
import { UserName } from "./user-name";

export interface IncomingUserProps {
  readonly email: UserEmail;
  readonly passwordHash: UserPasswordHash;
  readonly name: UserName;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;
}

export interface UserProps {
  readonly email: UserEmail;
  readonly password_hash: UserPasswordHash;
  readonly name: UserName;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id: Uuid) {
    super(props, id);
  }

  public get id() {
    return this._id.value;
  }

  public get email() {
    return this.props.email.value;
  }

  public get name() {
    return this.props.name.value;
  }

  public get password_hash() {
    return this.props.password_hash;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get deletedAt(): Date {
    return this.props.deletedAt;
  }

  public static create(props: IncomingUserProps, uuid: Uuid) {
    const nowDate = getNowDate();

    return new User(
      {
        email: props.email,
        name: props.name,
        password_hash: props.passwordHash,
        createdAt: props.createdAt ?? nowDate,
        updatedAt: props.updatedAt ?? nowDate,
        deletedAt: props.deletedAt ?? getEpochDate(),
      },
      uuid
    );
  }
}
