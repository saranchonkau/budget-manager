import * as z from "zod";

export const CreateUserDTOContract = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTOContract>;
