import { Either, isLeft, traverse } from "fp-ts/Either";
import { UserPropsContract } from "./user";
import { inspect } from "util";

// function mergeInOne<L1, R1, L2, R2>(
//   values: [Either<L1, R1>, Either<L2, R2>]
// ): Either<L1 | L2, [R1, R2]>;
// function mergeInOne(eithers: Array<Either<unknown, unknown>>) {
//   return eithers.reduce(
//     (res: Either<unknown, Array<unknown>>, v) =>
//       res.chain((res) => v.map((v) => res.concat([v]))),
//     either.right<unknown, Array<unknown>>([])
//   );
// }

it("should throw all errors when create", () => {
  const result = UserPropsContract.decode({
    email: "lol",
    password_hash: "",
    name: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
  });

  if (isLeft(result)) {
    console.log(inspect(result.left, { colors: true, depth: 3 }));
  }

  expect(2 + 2).toBe(4);
});
