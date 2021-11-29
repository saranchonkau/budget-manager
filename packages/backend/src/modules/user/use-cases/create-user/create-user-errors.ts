import { AppError } from "@/shared/app-error";
import { AppErrorBrand } from "@/shared/app-error-brands";

const brand = AppErrorBrand.UserAlreadyExistsError;

export class UserAlreadyExistsError extends AppError<typeof brand> {
  constructor(email: string) {
    super({
      brand,
      message: `Account with such email "${email}" is already exists`,
    });
  }
}
