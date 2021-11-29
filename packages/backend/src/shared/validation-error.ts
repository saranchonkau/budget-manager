import { ZodError } from "zod";
import { toFieldValidationErrorMap } from "@/utils/to-error-map";
import { AppError } from "@/shared/app-error";
import { AppErrorBrand } from "@/shared/app-error-brands";

export class FieldValidationError extends Error {
  private constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  public static fromZodError<T>(zodError: ZodError<T>) {
    const firstIssue = zodError.issues[0];

    if (!firstIssue || zodError.issues.length > 1) {
      throw new Error("ValidationError creation error");
    }

    return new FieldValidationError(firstIssue.message);
  }
}

const brand = AppErrorBrand.ValidationError;

export class ValidationError<
  I extends { [key in string]?: ZodError }
> extends AppError<typeof brand, { [key in string]?: string }> {
  constructor(options: { readonly message: string; readonly payload: I }) {
    super({
      brand,
      message: options.message,
      payload: toFieldValidationErrorMap(options.payload),
    });

    this.name = this.constructor.name;
  }
}
