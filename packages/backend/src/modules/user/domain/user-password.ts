import crypto from "crypto";
import { Either } from "@sweet-monads/either";
import { ValueObject } from "@/shared/value-object";
import * as z from "zod";
import { parseWithContract } from "@/shared/parse-with-contract";
import { InternalServerError } from "http-errors";
import { ZodError } from "zod";

/**
 * Salt
 */
type SaltType = string & { readonly _brand_: unique symbol };

const SALT_REGEX = /[0-9A-Fa-f]{32}/g;

function isSalt(value: string): value is SaltType {
  return SALT_REGEX.test(value);
}

function generateSalt(): SaltType {
  return crypto.randomBytes(8).toString("hex") as SaltType;
}

export const SaltContract = z.string().refine(isSalt, (value) => ({
  message: `Salt value must be a valid 16-bytes hex string, got: "${value}"`,
}));

interface SaltProps {
  value: SaltType;
}

class Salt extends ValueObject<SaltProps> {
  private constructor(props: SaltProps) {
    super(props);
  }

  public get value() {
    return this.props.value;
  }

  public static from(value: string) {
    return parseWithContract(SaltContract, value).mapRight(
      (value) => new Salt({ value })
    );
  }

  public static create() {
    return new Salt({ value: generateSalt() });
  }
}

/**
 * Password as plain text
 */
type PasswordType = string & { readonly _brand_: unique symbol };

const PASSWORD_REGEX = /[0-9A-Fa-f-_]{5,}/g;

function isPasswordValid(value: string): value is PasswordType {
  return PASSWORD_REGEX.test(value);
}

export const PasswordContract = z.string().refine(isPasswordValid, (value) => ({
  message: `Password value must be a string and have min 5 characters, got: "${value}"`,
}));

interface PasswordProps {
  value: PasswordType;
}

export class UserPassword extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  public get value() {
    return this.props.value;
  }

  public static from(
    plainText: string
  ): Either<ZodError<PasswordType>, UserPassword> {
    return parseWithContract(PasswordContract, plainText).mapRight(
      (password) => new UserPassword({ value: password })
    );
  }
}

/**
 * Password as hash
 */

export class InvalidPasswordError extends InternalServerError {
  constructor(error: Error) {
    super(
      `Invalid password. Password hash cannot be generated. Root cause: ${error.message}`
    );
  }
}

export class InvalidPasswordHashError extends InternalServerError {
  constructor(error: Error) {
    super(`Invalid password hash. Root cause: ${error.message}`);
  }
}

type PasswordHashType = string & { readonly _brand_: unique symbol };
type DerivedKeyType = string & { readonly _brand_: unique symbol };

const PASSWORD_HASH_REGEX =
  /^(?<salt>[0-9A-Fa-f]{32}):(?<derivedKey>[0-9A-Fa-f]{128})$/g;

function isPasswordHashValid(value: string): value is PasswordHashType {
  return PASSWORD_HASH_REGEX.test(value);
}

export const PasswordHashContract = z
  .string()
  .refine(isPasswordHashValid, (value) => ({
    message: `Password hash value must be a string and contain salt (16-bytes) and derived key (64-bytes), got: "${value}"`,
  }));

interface PasswordHashParseResult extends RegExpExecArray {
  groups: {
    salt: string;
    derivedKey: string;
  };
}

interface PasswordHashProps {
  salt: SaltType;
  derivedKey: DerivedKeyType;
}

export class UserPasswordHash extends ValueObject<PasswordHashProps> {
  private constructor(props: PasswordHashProps) {
    super(props);
  }

  private get salt() {
    return this.props.salt;
  }

  private get derivedKey() {
    return this.props.derivedKey;
  }

  private static async hashPassword(
    password: PasswordType,
    saltValue?: SaltType
  ): Promise<PasswordHashProps> {
    const salt = saltValue ?? Salt.create().value;

    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) {
          return reject(new InvalidPasswordError(error));
        }

        const result = {
          salt: salt,
          derivedKey: derivedKey.toString("hex") as DerivedKeyType,
        };

        resolve(result);
      });
    });
  }

  private static parsePasswordHash(
    passwordHash: PasswordHashType
  ): PasswordHashProps {
    const execResult = PASSWORD_HASH_REGEX.exec(
      passwordHash
    ) as PasswordHashParseResult;

    const groups = execResult.groups!;

    return {
      salt: groups.salt as SaltType,
      derivedKey: groups.derivedKey as DerivedKeyType,
    };
  }

  public static fromPassword(
    password: UserPassword
  ): Promise<UserPasswordHash> {
    return this.hashPassword(password.value).then(
      (props) => new UserPasswordHash(props)
    );
  }

  public static fromHash(value: string): UserPasswordHash {
    const passwordHashOrError = parseWithContract(PasswordHashContract, value);

    if (passwordHashOrError.isLeft()) {
      throw new InvalidPasswordHashError(passwordHashOrError.value);
    }

    const props = this.parsePasswordHash(passwordHashOrError.value);

    return new UserPasswordHash(props);
  }

  public async compare(password: PasswordType): Promise<boolean> {
    const passwordHashProps = await UserPasswordHash.hashPassword(
      password,
      this.salt
    );

    return passwordHashProps.derivedKey === this.derivedKey;
  }

  public override toString() {
    return this.salt + ":" + this.derivedKey;
  }
}
