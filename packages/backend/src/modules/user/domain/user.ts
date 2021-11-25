import { Entity } from "@/shared/entity";
import { Uuid } from "@/shared/uuid";
import { EPOCH_TIMESTAMP } from "@/constants/common";
import { getNowTimestamp } from "@/utils/get-now-timestamp";

import { UserEmail } from "./user-email";
import { UserPasswordHash } from "./user-password";
import { UserName } from "./user-name";

export interface IncomingUserProps {
  readonly email: UserEmail;
  readonly passwordHash: UserPasswordHash;
  readonly name: UserName;
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly deleted_at?: string;
}

export interface UserProps {
  readonly email: UserEmail;
  readonly password_hash: UserPasswordHash;
  readonly name: UserName;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string;
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

  public get created_at(): string {
    return this.props.created_at;
  }

  public get updated_at(): string {
    return this.props.updated_at;
  }

  public get deleted_at(): string {
    return this.props.deleted_at;
  }

  public static create(props: IncomingUserProps, uuid: Uuid) {
    const nowTimestamp = getNowTimestamp();

    return new User(
      {
        email: props.email,
        name: props.name,
        password_hash: props.passwordHash,
        created_at: props.created_at ?? nowTimestamp,
        updated_at: props.updated_at ?? nowTimestamp,
        deleted_at: props.deleted_at ?? EPOCH_TIMESTAMP,
      },
      uuid
    );
  }
}
