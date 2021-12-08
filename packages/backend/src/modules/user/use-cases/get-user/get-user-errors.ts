import { AppError } from "@/shared/app-error";
import { AppErrorBrand } from "@/shared/app-error-brands";
import { User } from "@/modules/user/domain/user";

const brand = AppErrorBrand.UserNotFoundError;

export class UserNotFoundError extends AppError<typeof brand> {
  constructor(id: User["id"]) {
    super({
      brand,
      message: `User with id "${id}" is not found`,
    });
  }
}
