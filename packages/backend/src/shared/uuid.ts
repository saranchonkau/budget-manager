import { v4 as generateUuid, validate, version } from "uuid";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { withMessage } from "io-ts-types/lib/withMessage";

interface UuidBrand {
  readonly Uuid: unique symbol;
}

function uuidValidateV4(uuid: string): boolean {
  return validate(uuid) && version(uuid) === 4;
}

export const UuidContract = withMessage(
  t.brand(
    t.string,
    (value): value is t.Branded<string, UuidBrand> => uuidValidateV4(value),
    "Uuid"
  ),
  (input, context) =>
    `UUID must be a string value with format: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', got: ${input}`
);

export type UuidType = t.TypeOf<typeof UuidContract>;

export class Uuid {
  private constructor(private readonly value: UuidType) {}

  public toValue() {
    return this.value;
  }

  public static create(uuid?: string) {
    const parsedUuid = UuidContract.decode(uuid ?? generateUuid());

    if (isLeft(parsedUuid)) {
      throw new Error("Invalid UUID");
    } else {
      return new Uuid(parsedUuid.right);
    }
  }
}
