import { ZodError } from "zod";
import { FieldValidationError } from "@/shared/validation-error";

export function toFieldValidationErrorMap<
  Map extends { [key in string]?: ZodError }
>(errorMap: Map) {
  const result: { [key: string]: FieldValidationError } = {};

  Object.entries(errorMap).forEach(([key, value]) => {
    if (value) {
      result[key] = FieldValidationError.fromZodError(value);
    }
  });

  return result as { [P in keyof Map]?: FieldValidationError };
}
