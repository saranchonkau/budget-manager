import { ZodError } from "zod";

import { parseWithContract } from "@/shared/parse-with-contract";
import { CreateUserDTOContract } from "@/modules/user/use-cases/create-user/create-user-dto";

import { convertZodIssuesToErrorObject } from "./convert-zod-error";

it("should convert to object correctly by path", () => {
  const body = {
    email: 12,
  };

  const result = parseWithContract(CreateUserDTOContract, body);

  expect(result.isLeft()).toBe(true);

  expect(convertZodIssuesToErrorObject(result.value as ZodError)).toStrictEqual(
    {
      name: "Required",
      email: "Expected string, received number",
      password: "Required",
    }
  );
});
