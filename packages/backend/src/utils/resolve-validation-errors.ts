import { Either, left, right } from "@sweet-monads/either";

export function divideLeftAndRight<
  T extends { [key in string]: Either<any, any> }
>(
  map: T
): Either<
  {
    [P in keyof typeof map]?: typeof map[P] extends Either<infer E, infer V>
      ? E
      : never;
  },
  {
    [P in keyof typeof map]: typeof map[P] extends Either<infer E, infer V>
      ? V
      : never;
  }
> {
  const errors: Record<string, any> = {};
  const values: Record<string, any> = {};

  Object.entries(map).forEach(([key, valueOrError]) => {
    if (valueOrError.isLeft()) {
      errors[key] = valueOrError.value;
    } else {
      values[key] = valueOrError.value;
    }
  });

  // @ts-ignore
  return Object.keys(errors).length > 0 ? left(errors) : right(values);
}
