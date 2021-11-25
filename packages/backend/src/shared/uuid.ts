import { v4 as generateUuid, validate, version } from "uuid";
import * as z from "zod";
import { parseWithContract } from "./parse-with-contract";
import { ValueObject } from "./value-object";

type UuidType = string & { readonly _brand_: unique symbol };

function isUuidV4(uuid: string): uuid is UuidType {
  return validate(uuid) && version(uuid) === 4;
}

export const UuidContract = z.string().refine(isUuidV4, (value) => ({
  message: `UUID must be a string value with format: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', got: "${value}"`,
}));

interface UuidProps {
  value: UuidType;
}

export class Uuid extends ValueObject<UuidProps> {
  private constructor(props: UuidProps) {
    super(props);
  }

  public get value() {
    return this.props.value;
  }

  public static create() {
    return new Uuid({ value: generateUuid() as UuidType });
  }

  public static from(uuid: string) {
    return parseWithContract(UuidContract, uuid).mapRight(
      (value) => new Uuid({ value })
    );
  }
}
