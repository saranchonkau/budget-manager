import { Either } from "@sweet-monads/either";

export interface UnknownObject {
  [key: string]: any;
}

export type StringLiteral<T> = T extends `${string & T}` ? T : never;

export type Left<E extends Either<any, any>> = E extends Either<
  infer L,
  infer R
>
  ? L
  : never;

export type Right<E extends Either<any, any>> = E extends Either<
  infer L,
  infer R
>
  ? R
  : never;
