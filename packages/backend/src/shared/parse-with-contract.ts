import { ZodType } from "zod/lib/types";
import { right, left, Either } from "@sweet-monads/either";
import { ZodError } from "zod";

export function parseWithContract<T, V>(
  contract: ZodType<T>,
  value: V
): Either<ZodError<T>, T> {
  const result = contract.safeParse(value);
  return result.success ? right(result.data) : left(result.error);
}
