import { ZodError } from "zod";
import set from "lodash/set";
import { UnknownObject } from "@/types/common";

export function convertZodIssuesToErrorObject(error: ZodError): UnknownObject {
  const errors: UnknownObject = {};

  error.issues.forEach((issue) => {
    set(errors, issue.path, issue.message);
  });

  return errors;
}
